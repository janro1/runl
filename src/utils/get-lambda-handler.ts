import type { Handler } from 'aws-lambda';
import { LambdaOptions } from '../types';

class LambdaHandlerError extends Error {
  constructor(message: string, error: Error) {
    super(message);
    this.name = this.constructor.name;

    this.stack = this.stack + '\n' + error.stack;
  }
}

export const getLambdaHandler = (options: LambdaOptions): Handler => {
  const lambdaHandler = options.lambdaHandler || 'handler';

  try {
    const lambdaFunction = require(options.lambdaPath);

    if (!(lambdaHandler in lambdaFunction)) {
      throw new Error(`lambdaHandler ${lambdaHandler} is not exported!`);
    }

    return lambdaFunction[lambdaHandler] as Handler;
  } catch (e) {
    throw new LambdaHandlerError(
      `Unable to require lambda handler from ${options.lambdaPath}`,
      e
    );
  }
};
