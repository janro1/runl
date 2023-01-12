import type { APIGatewayProxyEvent } from 'aws-lambda';
import { DeepPartial, LambdaMode, LambdaOptions } from './types.js';
export { LambdaMode };
export declare abstract class LambdaBase {
    private cp;
    private lastUpdated;
    private requestCount;
    protected lambdaWrapperPath: string | undefined;
    protected readonly options: LambdaOptions;
    protected abstract readonly lambdaHander: string;
    constructor(options: LambdaOptions);
    init: () => void;
    execute: <T>(event?: DeepPartial<APIGatewayProxyEvent>) => Promise<T>;
    stop: () => void;
    private createFork;
    private getOrCreateFork;
    private newRequestNumber;
    private getLambdaWrapperPath;
    private isForkUpToDate;
    protected abstract absoluteLambdaHandlerPath(): string;
    protected abstract findLambdaWrapperPath(): string | undefined;
}
