import { fork } from 'child_process';
import { findPackageFile } from './find-package-file';
import { isLambdaError, isLambdaResponse, Options } from './types';

let lambdaWrapperPath: string | undefined;

export const execute = <T>(options: Options): Promise<T> =>
  new Promise<T>((rs, rj) => {
    let isResolved = false;

    if (!lambdaWrapperPath) {
      lambdaWrapperPath = findPackageFile('execute.js');
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
      if (isResolved) {
        return;
      }

      if (isLambdaError<T>(data)) {
        isResolved = true;
        rj(data.error);
      }

      if (isLambdaResponse<T>(data)) {
        isResolved = true;
        rs(data.result);
      }
    });

    lambda.on('close', (code) => {
      if (!isResolved) {
        rj({ error: 'child process exited with code ' + code });
      }
    });
  });
