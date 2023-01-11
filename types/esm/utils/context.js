import * as crypto from 'crypto';
export class LambdaContext {
    startTime = new Date().getTime();
    lambdaTimeout = 30000;
    callbackWaitsForEmptyEventLoop;
    functionName;
    functionVersion;
    invokedFunctionArn;
    memoryLimitInMB;
    awsRequestId;
    logGroupName;
    logStreamName;
    constructor(options) {
        this.lambdaTimeout = options.lambdaTimeout || this.lambdaTimeout;
        this.functionName = options.lambdaHandler || 'runl';
        this.memoryLimitInMB = '3000';
        this.functionVersion = '1';
        this.invokedFunctionArn = this.createInvokedFunctionArn();
        this.logGroupName = '1';
        this.logStreamName = 'runl-logs';
        this.awsRequestId = this.createAWSRequestId();
        this.callbackWaitsForEmptyEventLoop = false;
    }
    getRemainingTimeInMillis = () => {
        const now = new Date().getTime();
        return this.lambdaTimeout - (now - this.startTime);
    };
    done = () => {
        throw new Error('Method not implemented.');
    };
    fail = () => {
        throw new Error('Method not implemented.');
    };
    succeed = () => {
        throw new Error('Method not implemented.');
    };
    createInvokedFunctionArn = () => [
        'arn',
        'aws',
        'lambda',
        'us-east-1',
        `${Math.round(Math.random() * Math.pow(10, 12))}`,
        'function',
        this.functionName,
        this.functionVersion
    ].join(':');
    createAWSRequestId = () => {
        const hash = crypto
            .createHash('sha256')
            .update(crypto.randomBytes(20).toString())
            .digest('hex');
        return [
            hash.slice(0, 8),
            hash.slice(8, 12),
            hash.slice(12, 16),
            hash.slice(16, 20),
            hash.slice(20, 32)
        ].join('-');
    };
}
