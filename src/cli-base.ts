/* eslint-disable no-console */

import * as path from 'path';
import { readFileSync } from 'fs';
import { LambdaMode, LambdaOptions, WithEvent } from './types';
import { LambdaBase } from './lambda-base';

const usage = (): string => `NAME
  runl-cli run lambda functions locally
SYNOPSIS
  runl-cli [OPTION]... LAMBDA_PATH
DESCRIPTION
  -t, --timeout
      maximal execution time in ms
  -e, --env
      environment variables, either a JSON object or file path
  -o, --event
      the event object passed to the lambda function, either a JSON object or file path
  -h, --handler
      the name of lambda handler, defaults to: handler
`;

const toNumber = (value: string): number | undefined => {
  const number = parseInt(value, 10);

  if (isNaN(number)) return undefined;

  return number;
};

const parseJsonString = (
  value: string
): { readonly [key: string]: string } | undefined => {
  try {
    return JSON.parse(value);
  } catch (e) {
    console.error(e);

    throw new Error(`Unable to parse JSON string '${value}'`);
  }
};

const readJsonFile = (filePath: string): string => {
  try {
    return readFileSync(path.join(process.cwd(), filePath), 'utf-8');
  } catch (e) {
    console.error(e);

    throw new Error(`Unable to read JSON in file ${filePath}`);
  }
};

const extractOption = (
  processArgs: string[]
): [string[], Partial<LambdaOptions & WithEvent>] => {
  if (processArgs[0] === '-t' || processArgs[0] === '--timeout') {
    if (processArgs.length > 1) {
      const timeout = toNumber(processArgs[1]);

      if (timeout)
        return [
          processArgs.slice(2, processArgs.length),
          { lambdaTimeout: timeout }
        ];
    }
  }

  if (processArgs[0] === '-h' || processArgs[0] === '--handler') {
    if (processArgs.length > 1) {
      const handler = processArgs[1];

      if (handler)
        return [
          processArgs.slice(2, processArgs.length),
          { lambdaHandler: handler }
        ];
    }
  }

  if (processArgs[0] === '-e' || processArgs[0] === '--env') {
    if (processArgs.length > 1) {
      const envVars = processArgs[1].startsWith('{')
        ? parseJsonString(processArgs[1])
        : parseJsonString(readJsonFile(processArgs[1]));

      if (envVars)
        return [
          processArgs.slice(2, processArgs.length),
          { environment: envVars }
        ];
    }
  }

  if (processArgs[0] === '-o' || processArgs[0] === '--event') {
    if (processArgs.length > 1) {
      const event = processArgs[1].startsWith('{')
        ? parseJsonString(processArgs[1])
        : parseJsonString(readJsonFile(processArgs[1]));

      if (event)
        return [processArgs.slice(2, processArgs.length), { event: event }];
    }
  }

  return [[], {}];
};

const parseArgs = (
  processArgs: string[],
  args: Partial<LambdaOptions & WithEvent> = {}
): LambdaOptions | (LambdaOptions & WithEvent) | undefined => {
  if (!processArgs.length) return undefined;

  if (processArgs.length === 1) {
    const lambdaPath = path.join(process.cwd(), processArgs[0]);
    return { ...args, lambdaPath, mode: LambdaMode.Ephemeral };
  }

  const [remainingArgs, option] = extractOption(processArgs);
  return parseArgs(remainingArgs, { ...args, ...option });
};

export const run = async (
  createLambda: (args: LambdaOptions) => LambdaBase
): Promise<void> => {
  const [, , ...processArgs] = process.argv;
  const args = parseArgs(processArgs);

  if (!args) {
    console.log(usage());
    process.exit(1);
  }

  console.log('running lambda from:', args.lambdaPath);

  const lambda = createLambda(args);

  try {
    const event = 'event' in args ? args.event : undefined;
    const result = await lambda.execute(event);

    console.log(result);
  } catch (e) {
    console.error(e);
  }
};
