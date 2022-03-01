import { LambdaContext } from '../utils/context';
import { isOption, Options } from '../types';
import { getLambdaHandler } from '../utils/get-lambda-handler';

export const runLambda = async () => {
  process.on('message', async (rawOptions: string) => {
    const options = JSON.parse(rawOptions) as Options & { requestHash: string };

    if (!isOption(options)) {
      throw new Error('Unable to execute lambda function, no options given.');
    }

    const handler = getLambdaHandler(options);
    const context = new LambdaContext(options);
    const callback = (result: unknown) => {
      process.send &&
        process.send({ result, requestHash: options.requestHash });
    };

    try {
      const result = handler(options.event, context, callback);

      if (result && result.then) {
        result.then((result) => {
          process.send &&
            process.send({
              result,
              requestHash: options.requestHash
            });
        });
      }
    } catch (error) {
      process.send && process.send({ error, requestHash: options.requestHash });
    }
  });

  process.stdin.resume();
};

runLambda();
