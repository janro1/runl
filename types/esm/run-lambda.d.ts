import type { Handler } from 'aws-lambda';
import { LambdaOptions } from './types.js';
type LambdaHandlerLoader = (options: LambdaOptions) => Promise<Handler>;
export declare const runLambda: (loader: LambdaHandlerLoader) => Promise<void>;
export {};
