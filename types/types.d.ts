import type { APIGatewayProxyEvent } from 'aws-lambda';
declare type DeepPartial<T> = {
    [k in keyof T]?: DeepPartial<T[k]>;
};
export declare type Options = {
    readonly event?: DeepPartial<APIGatewayProxyEvent>;
    readonly environment?: {
        readonly [key: string]: string;
    };
    readonly lambdaPath: string;
    readonly lambdaHandler?: string;
    readonly lambdaTimeout?: number;
};
export declare const isOption: (value: unknown) => value is Options;
declare type LambdaResponse<T> = {
    requestHash: string;
    result: T;
};
declare type LambdaError<T> = {
    requestHash: string;
    error: T;
};
export declare const isLambdaResponse: <T>(value: unknown) => value is LambdaResponse<T>;
export declare const isLambdaError: <T>(value: unknown) => value is LambdaError<T>;
export declare type LambdaResult<T> = LambdaResponse<T> | LambdaError<T>;
export {};
