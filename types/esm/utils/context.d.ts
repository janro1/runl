import type { Context } from 'aws-lambda';
import type { LambdaOptions } from '../types.js';
export declare class LambdaContext implements Context {
    private startTime;
    private lambdaTimeout;
    callbackWaitsForEmptyEventLoop: boolean;
    functionName: string;
    functionVersion: string;
    invokedFunctionArn: string;
    memoryLimitInMB: string;
    awsRequestId: string;
    logGroupName: string;
    logStreamName: string;
    constructor(options: LambdaOptions);
    getRemainingTimeInMillis: () => number;
    done: () => void;
    fail: () => void;
    succeed: () => void;
    private createInvokedFunctionArn;
    private createAWSRequestId;
}
