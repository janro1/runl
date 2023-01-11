import { runLambda } from './run-lambda.js';
import { createLambdaLoader } from './utils/lambda-loader.js';

const cjsLoader = createLambdaLoader((handlerPath: string) =>
  require(handlerPath)
);

runLambda(cjsLoader);
