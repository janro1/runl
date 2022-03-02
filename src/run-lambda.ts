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
      throw new Error('Unable to execute lambda function, no options given.');
    }

    const handler = getLambdaHandler(options);
    const context = new LambdaContext(options);
    const callback = (result: unknown): void => {
      process.send &&
        process.send({ result, requestHash: options.requestNumber });
    };

    try {
      const result = handler(options.event, context, callback);

      if (result && result.then) {
        result.then((result) => {
          process.send &&
            process.send({
              result,
              requestNumber: options.requestNumber
            });
        });
      }
    } catch (error) {
      process.send &&
        process.send({ error, requestNumber: options.requestNumber });
    }
  });

  process.stdin.resume();
};

runLambda();
