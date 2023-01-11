import { runLambda } from './run-lambda.js';
import { createLambdaLoader } from './utils/lambda-loader.js';
const mjsLoader = createLambdaLoader((handlerPath) => import(handlerPath));
runLambda(mjsLoader);
