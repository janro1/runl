import type { Handler } from 'aws-lambda';
import type { LambdaOptions } from '../types.js';
export declare const createLambdaLoader: (moduleLoader: (path: string) => Promise<unknown>) => (options: LambdaOptions) => Promise<Handler>;
