import type { LambdaOptions } from '../types';

const isInspectArg = (arg: string): boolean =>
  arg.startsWith('inspect') || arg.startsWith('--inspect');

const isInspectSetViaEnv = (): boolean => {
  const nodeEnv = process.env['NODE_OPTIONS'] || process.env['NODE'];

  return nodeEnv ? nodeEnv.split('--').some(isInspectArg) : false;
};

const isInspectSetViaArg = (): boolean => process.execArgv.some(isInspectArg);

export const createExecArgv = (options: LambdaOptions): string[] => {
  if (options.debugPort) {
    if (isInspectSetViaArg()) {
      return process.execArgv.map((arg) =>
        isInspectArg(arg) ? `--inspect=${options.debugPort}` : arg
      );
    }

    if (isInspectSetViaEnv()) {
      process.execArgv.push(`--inspect=${options.debugPort}`);
      return process.execArgv;
    }
  }

  return process.execArgv;
};
