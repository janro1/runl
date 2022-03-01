import { fork } from 'child_process';
import { findPackageFile } from '../utils/find-package-file';
import { isLambdaError, isLambdaResponse, Options } from '../types';

let lambdaWrapperPath: string | undefined;

export const execute = <T>(options: Options): Promise<T> =>
  new Promise<T>((rs, rj) => {
    if (!lambdaWrapperPath) {
      lambdaWrapperPath = findPackageFile('./execute/execute-lambda.js');
    }

    if (!lambdaWrapperPath) {
      throw new Error('Unable to load lambda wrapper source');
    }

    const lambda = fork(lambdaWrapperPath, {
      timeout: options.lambdaTimeout,
      env: {
        __RUNL_OPTIONS__: JSON.stringify(options),
        ...(options.environment ?? {})
      }
    });

    lambda.on('message', (data) => {
      if (isLambdaError<T>(data)) {
        rj(data.error);
      }

      if (isLambdaResponse<T>(data)) {
        rs(data.result);
      }
    });

    lambda.on('close', (code) => {
      if (code === null) {
        rj({ error: 'lambda timeout' });
      } else {
        rj({ error: 'lambda exited without result. exit code: ' + code });
      }
    });
  });
