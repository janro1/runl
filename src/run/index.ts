import { ChildProcess, fork, Serializable } from 'child_process';
import * as crypto from 'crypto';
import { findPackageFile } from '../utils/find-package-file';
import { isLambdaError, isLambdaResponse, Options } from '../types';

export type runProps = {
  execute: <T>(options: Options) => Promise<T>;
  stop: () => void;
};

type HandleMessageOptions<T> = {
  resolve: (value: T | PromiseLike<T>) => void;
  reject: (reason?: unknown) => void;
  requestHash: string;
  timeout: NodeJS.Timeout;
};

const handleMessage = <T>(
  options: HandleMessageOptions<T>,
  data: Serializable
) => {
  const { resolve, reject, requestHash, timeout } = options;

  if (isLambdaError<T>(data)) {
    if (data.requestHash === requestHash) {
      clearTimeout(timeout);
      reject(data.error);
    }
  }

  if (isLambdaResponse<T>(data)) {
    if (data.requestHash === requestHash) {
      clearTimeout(timeout);
      resolve(data.result);
    }
  }
};

const execute = <T>(
  lambdaWrapperPath: string,
  forkMap: Map<string, ChildProcess>,
  options: Options
): Promise<T> => {
  const requestHash = crypto
    .createHash('sha256')
    .update(crypto.randomBytes(20).toString())
    .digest('hex');

  if (!forkMap.has(options.lambdaPath)) {
    const lambdaFork = fork(lambdaWrapperPath, {
      env: {
        ...(options.environment ?? {})
      }
    });
    forkMap.set(options.lambdaPath, lambdaFork);
  }

  const cp = forkMap.get(options.lambdaPath);

  if (!cp) {
    throw new Error('something went terribly wrong!');
  }

  cp.send(JSON.stringify({ ...options, requestHash }));

  let messageHandler: (message: Serializable) => void;

  return new Promise<T>((resolve, reject) => {
    const timeout = setTimeout(
      () => reject({ error: 'lambda timeout' }),
      options.lambdaTimeout ?? 30000
    );

    messageHandler = (message: Serializable) =>
      handleMessage(
        {
          resolve,
          reject,
          requestHash,
          timeout
        },
        message
      );
    cp.on('message', messageHandler);
  }).finally(() => {
    cp.off('message', messageHandler);
  });
};

export const run = (): runProps => {
  const forkMap: Map<string, ChildProcess> = new Map();
  const lambdaWrapperPath = findPackageFile('./run/run-lambda.js');

  if (!lambdaWrapperPath) {
    throw new Error('Unable to load lambda wrapper');
  }

  return {
    execute: (options: Options) => execute(lambdaWrapperPath, forkMap, options),
    stop: () => {
      forkMap.forEach((fork) => {
        fork.kill();
      });
      forkMap.clear();
    }
  };
};
