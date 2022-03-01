import { LambdaContext } from '../utils/context';
import { isOption } from '../types';
import { getLambdaHandler } from '../utils/get-lambda-handler';

export const executeLambda = async () => {
  const options = JSON.parse(process.env.__RUNL_OPTIONS__ || '{}');

  if (!isOption(options)) {
    throw new Error('Unable to execute lambda function, no options given.');
  }

  const handler = getLambdaHandler(options);
  const context = new LambdaContext(options);
  const callback = (result: unknown) => {
    process.send && process.send(result);
  };

  try {
    const result = handler(options.event, context, callback);

    if (result && result.then) {
      result.then((result) => {
        process.send && process.send({ result });
      });
    }
  } catch (error) {
    process.send && process.send({ error });
  }
};

executeLambda();
