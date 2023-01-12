import { LambdaMode, LambdaOptions } from './types.js';
import { LambdaBase } from './lambda-base.js';
export { LambdaMode };
export declare class Lambda extends LambdaBase {
    protected readonly lambdaHander: string;
    constructor(options: LambdaOptions);
    protected absoluteLambdaHandlerPath: () => string;
    protected findLambdaWrapperPath: () => string | undefined;
}
