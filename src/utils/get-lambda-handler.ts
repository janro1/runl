import type { Handler } from 'aws-lambda';
import { LambdaOptions } from '../types';

export const getLambdaHandler = (options: LambdaOptions): Handler => {
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
