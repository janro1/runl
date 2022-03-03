import type { Serializable } from 'child_process';
import type { APIGatewayProxyEvent } from 'aws-lambda';

export type DeepPartial<T> = { [k in keyof T]?: DeepPartial<T[k]> };

export const enum LambdaMode {
  Ephemeral = 'Ephemeral',
  Persistent = 'Persistent'
}

export type LambdaOptions = {
  readonly mode: LambdaMode;
  readonly lambdaPath: string;
  readonly autoReload?: boolean;
  readonly environment?: { readonly [key: string]: string };
  readonly lambdaTimeout?: number;
  readonly lambdaHandler?: string;
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

export type LambdaError<T> = WithRequestNumber & {
  readonly error: T;
};

export type LambdaResult<T> = LambdaResponse<T> | LambdaError<T>;

const hasProperty = <T extends Serializable>(
  value: Serializable,
  key: string
): value is T => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  return key in value;
};

export const isOption = (value: Serializable): value is LambdaOptions =>
  hasProperty(value, 'lambdaPath') && hasProperty(value, 'mode');

export const isWithRequestNumber = (
  value: Serializable
): value is WithRequestNumber => hasProperty(value, 'requestNumber');

export const isWithEvent = (value: Serializable): value is WithEvent =>
  hasProperty(value, 'event');

export const isLambdaResponse = <T>(
  value: Serializable
): value is LambdaResponse<T> => hasProperty(value, 'result');

export const isLambdaError = <T>(
  value: Serializable
): value is LambdaError<T> => hasProperty(value, 'error');
