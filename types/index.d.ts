import type { APIGatewayProxyEvent } from 'aws-lambda';
import { DeepPartial, LambdaMode, LambdaOptions } from './types';
export { LambdaMode };
export declare class Lambda {
    private readonly options;
    private cp;
    private lastUpdated;
    private lambdaWrapperPath;
    private requestCount;
    constructor(options: LambdaOptions);
    init: () => void;
    execute: <T>(event?: DeepPartial<APIGatewayProxyEvent>) => Promise<T>;
    stop: () => void;
    private createFork;
    private getOrCreateFork;
    private newRequestNumber;
    private getLambdaWrapperPath;
    private isForkUpToDate;
}
