import type { Handler } from 'aws-lambda';
import { LambdaContext } from './context';
import { isOption, Options } from './types';

const getLambdaHandler = (options: Options) => {
  const lambdaHandler = options.lambdaHandler || 'handler';

  try {
    const lambdaFunction = require(options.lambdaPath);

    if (!(lambdaHandler in lambdaFunction)) {
      throw new Error(`lambdaHandler ${lambdaHandler} is not exported!`);
    }

    return lambdaFunction[lambdaHandler] as Handler;
  } catch (e) {
    throw new Error(`Unable to load lambda handler from ${options.lambdaPath}`);
  }
};

export const execute = async () => {
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

execute();
