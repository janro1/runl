/* eslint-disable no-console */

import type { Callback, Handler } from 'aws-lambda';
import { LambdaContext } from './utils/context.js';
import {
  type LambdaOptions,
  type WithEvent,
  type WithRequestNumber,
  isOption,
  isWithEvent,
  isWithRequestNumber
} from './types.js';
import { serializeError } from './utils/error.js';

type RawHandlerOptions = LambdaOptions & WithRequestNumber & WithEvent;

type LambdaHandlerLoader = (options: LambdaOptions) => Promise<Handler>;

const isValidOption = (options: RawHandlerOptions): boolean =>
  isOption(options) && isWithRequestNumber(options) && isWithEvent(options);

const getOptions = (rawOptions: string): RawHandlerOptions => {
  const options = JSON.parse(rawOptions);

  if (!isValidOption(options)) {
    throw new Error('Unable to execute lambda handler, invalid options given.');
  }

  return options;
};

const isSerializeableError = (value: unknown): value is Error | string =>
  value !== null && (typeof value === 'string' || value instanceof Error);

export const runLambda = async (loader: LambdaHandlerLoader): Promise<void> => {
  process.on('message', async (rawOptions: string) => {
    const options = getOptions(rawOptions);

    try {
      const handler = await loader(options);
      const context = new LambdaContext(options);

      const callback: Callback = (error, result): void => {
        if (!process.send) {
          console.error('process.send is undefined');

          return;
        }

        process.send({
          result: result ?? undefined,
          error: error ? serializeError(error) : undefined,
          requestNumber: options.requestNumber
        });
      };

      const resultPromise = handler(options.event, context, callback);

      if (!resultPromise || !resultPromise.then) {
        return;
      }

      if (!process.send) {
        console.error('process.send is undefined');

        return;
      }

      const result = await resultPromise;
      process.send({
        result,
        requestNumber: options.requestNumber
      });
    } catch (e) {
      if (process.send && isSerializeableError(e)) {
        process.send({
          error: serializeError(e),
          requestNumber: options.requestNumber
        });
      } else {
        console.error('Unable to execute Lambda', e);
      }
    }
  });

  process.stdin.resume();
};
