/// <reference types="node" resolution-mode="require"/>
import type { Serializable } from 'child_process';
import type { APIGatewayProxyEvent } from 'aws-lambda';
export type DeepPartial<T> = {
    [k in keyof T]?: DeepPartial<T[k]>;
};
export declare enum LambdaMode {
    Ephemeral = "Ephemeral",
    Persistent = "Persistent"
}
export type LambdaOptions = {
    readonly mode: LambdaMode;
    readonly lambdaPath: string;
    readonly autoReload?: boolean;
    readonly environment?: {
        readonly [key: string]: string;
    };
    readonly lambdaTimeout?: number;
    readonly lambdaHandler?: string;
    readonly debugPort?: number;
};
export type WithRequestNumber = {
    readonly requestNumber: number;
};
export type WithEvent = {
    readonly event: DeepPartial<APIGatewayProxyEvent>;
};
export type LambdaResponse<T> = WithRequestNumber & {
    readonly result: T;
};
export type ErrorContainer = WithRequestNumber & {
    readonly error: Serializable;
};
export type SerializableError = {
    message: string;
    stack: string | undefined;
};
export type LambdaError = WithRequestNumber & {
    readonly error: SerializableError;
};
export type LambdaResult<T> = LambdaResponse<T> | LambdaError;
export declare const isOption: (value: Serializable) => value is LambdaOptions;
export declare const isWithRequestNumber: (value: Serializable) => value is WithRequestNumber;
export declare const isWithEvent: (value: Serializable) => value is WithEvent;
export declare const isLambdaResponse: <T>(value: Serializable) => value is LambdaResponse<T>;
export declare const isLambdaError: (value: Serializable) => value is LambdaError;
