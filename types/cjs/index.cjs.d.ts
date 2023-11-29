/// <reference types="node" resolution-mode="require"/>
import { type LambdaOptions, LambdaMode } from './types.js';
import { LambdaBase } from './lambda-base.js';
export { LambdaMode };
export declare class Lambda extends LambdaBase {
    protected readonly lambdaHander: string;
    constructor(options: LambdaOptions);
    protected absoluteLambdaHandlerPath: () => string;
    protected getRequireFunction: () => NodeRequire;
    protected findLambdaWrapperPath: () => string | undefined;
}
