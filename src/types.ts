import type { APIGatewayProxyEvent } from 'aws-lambda';

type DeepPartial<T> = { [k in keyof T]?: DeepPartial<T[k]> };

export type Options = {
  readonly event?: DeepPartial<APIGatewayProxyEvent>;
  readonly environment?: { readonly [key: string]: string };
  readonly lambdaPath: string;
  readonly lambdaHandler?: string;
  readonly lambdaTimeout?: number;
};

export const isOption = (value: unknown): value is Options => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  return 'lambdaPath' in value;
};

type LambdaResponse<T> = {
  result: T;
};

type LambdaError<T> = {
  error: T;
};

export const isLambdaResponse = <T>(
  value: unknown
): value is LambdaResponse<T> => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  return 'result' in value;
};

export const isLambdaError = <T>(value: unknown): value is LambdaError<T> => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  return 'error' in value;
};

export type LambdaResult<T> = LambdaResponse<T> | LambdaError<T>;
