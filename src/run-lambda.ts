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

const isValidOption = (
  options: LambdaOptions & WithRequestNumber & WithEvent
): boolean =>
  isOption(options) && isWithRequestNumber(options) && isWithEvent(options);

export const runLambda = async (): Promise<void> => {
  process.on('message', async (rawOptions: string) => {
    const options = JSON.parse(rawOptions) as LambdaOptions &
      WithRequestNumber &
      WithEvent;

    if (!isValidOption(options)) {
      throw new Error(
        'Unable to execute lambda handler, invalid options given.'
      );
    }

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

    try {
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
