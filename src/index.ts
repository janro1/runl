/* eslint-disable no-console */

import { ChildProcess, fork } from 'child_process';
import type { APIGatewayProxyEvent } from 'aws-lambda';
import { findPackageFile } from './utils/find-package-file';
import { lastModified } from './utils/last-modified';
import { DeepPartial, LambdaMode, LambdaOptions } from './types';
import { Channel } from './channel';

export { LambdaMode };

export class Lambda {
  private readonly options: LambdaOptions;

  private cp: ChildProcess | undefined;

  private lastUpdated: number | undefined;

  private lambdaWrapperPath: string | undefined;

  private requestCount = 0;

  constructor(options: LambdaOptions) {
    this.options = options;
  }

  public init = (): void => {
    if (this.options.mode === LambdaMode.Ephemeral) {
      console.warn('init() called with no effect. Lambda mode is ephemeral.');

      return;
    }

    if (this.cp) {
      return;
    }

    this.cp = this.createFork();
  };

  public execute = <T>(
    event?: DeepPartial<APIGatewayProxyEvent>
  ): Promise<T> => {
    const requestNumber = this.newRequestNumber();
    const cp =
      this.options.mode === LambdaMode.Ephemeral
        ? this.createFork()
        : this.getOrCreateFork();

    const channel = new Channel<T>(cp, requestNumber);

    channel.send({
      ...this.options,
      event: event ?? {},
      requestNumber
    });

    return new Promise<T>((resolve, reject) => {
      channel.waitForMessage(
        resolve,
        reject,
        this.options.lambdaTimeout || 30000
      );
    }).finally(() => {
      channel.close();

      if (this.options.mode === LambdaMode.Ephemeral) {
        cp.kill();
      }
    });
  };

  public stop = (): void => {
    this.cp?.kill();
    if (this.cp?.killed) {
      this.cp = undefined;
    }
  };

  private createFork = (): ChildProcess => {
    const lambdaWrapperPath = this.getLambdaWrapperPath();

    const cp = fork(lambdaWrapperPath, {
      env: {
        ...(this.options.environment ?? {})
      }
    });

    this.lastUpdated = lastModified(this.options.lambdaPath);

    return cp;
  };

  private getOrCreateFork = (): ChildProcess => {
    if (!this.cp) {
      this.cp = this.createFork();
    }

    if (!this.isForkUpToDate()) {
      this.cp.kill();
      this.cp = this.createFork();
    }

    return this.cp;
  };

  private newRequestNumber = (): number => ++this.requestCount;

  private getLambdaWrapperPath = (): string => {
    if (this.lambdaWrapperPath) {
      return this.lambdaWrapperPath;
    }

    const lambdaWrapperPath = findPackageFile('./run-lambda.js');

    if (!lambdaWrapperPath) {
      throw new Error('Unable to load lambda wrapper');
    }

    this.lambdaWrapperPath = lambdaWrapperPath;

    return lambdaWrapperPath;
  };

  private isForkUpToDate = (): boolean => {
    if (!this.options.autoReload) {
      return true;
    }

    return lastModified(this.options.lambdaPath) === this.lastUpdated;
  };
}
