import * as crypto from 'crypto';
import type { Context } from 'aws-lambda';
import type { LambdaOptions } from '../types';

export class LambdaContext implements Context {
  private startTime = new Date().getTime();

  private lambdaTimeout = 30000;

  public callbackWaitsForEmptyEventLoop: boolean;

  public functionName: string;

  public functionVersion: string;

  public invokedFunctionArn: string;

  public memoryLimitInMB: string;

  public awsRequestId: string;

  public logGroupName: string;

  public logStreamName: string;

  constructor(options: LambdaOptions) {
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

  public getRemainingTimeInMillis = (): number => {
    const now = new Date().getTime();
    return this.lambdaTimeout - (now - this.startTime);
  };

  public done = (): void => {
    throw new Error('Method not implemented.');
  };

  public fail = (): void => {
    throw new Error('Method not implemented.');
  };

  public succeed = (): void => {
    throw new Error('Method not implemented.');
  };

  private createInvokedFunctionArn = (): string =>
    [
      'arn',
      'aws',
      'lambda',
      'us-east-1',
      `${Math.round(Math.random() * Math.pow(10, 12))}`,
      'function',
      this.functionName,
      this.functionVersion
    ].join(':');

  private createAWSRequestId = (): string => {
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
