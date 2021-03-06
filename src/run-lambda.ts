/* eslint-disable no-console */

import type { Callback } from 'aws-lambda';
import { LambdaContext } from './utils/context';
import { getLambdaHandler } from './utils/get-lambda-handler';
import {
  isOption,
  isWithEvent,
  isWithRequestNumber,
  LambdaOptions,
  WithEvent,
  WithRequestNumber
} from './types';
import { serializeError } from './utils/error';

type RawHandlerOptions = LambdaOptions & WithRequestNumber & WithEvent;

const isValidOption = (options: RawHandlerOptions): boolean =>
  isOption(options) && isWithRequestNumber(options) && isWithEvent(options);

const getOptions = (rawOptions: string): RawHandlerOptions => {
  const options = JSON.parse(rawOptions);

  if (!isValidOption(options)) {
    throw new Error('Unable to execute lambda handler, invalid options given.');
  }

  return options;
};

export const runLambda = async (): Promise<void> => {
  process.on('message', async (rawOptions: string) => {
    const options = getOptions(rawOptions);

    try {
      const handler = getLambdaHandler(options);
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
    } catch (error) {
      process.send({
        error: serializeError(error),
        requestNumber: options.requestNumber
      });
    }
  });

  process.stdin.resume();
};

runLambda();
