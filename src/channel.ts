import type { ChildProcess, Serializable } from 'child_process';
import { isLambdaError, isLambdaResponse, isWithRequestNumber } from './types';

export class Channel<T> {
  private readonly cp: ChildProcess;

  private readonly requestNumber: number;

  private timeout: NodeJS.Timeout | undefined;

  private resolve: ((value: T | PromiseLike<T>) => void) | undefined;

  private reject: ((reason?: unknown) => void) | undefined;

  constructor(cp: ChildProcess, requestNumber: number) {
    this.cp = cp;
    this.requestNumber = requestNumber;
  }

  public send = (data: Serializable): void => {
    this.cp.send(JSON.stringify(data));
  };

  public waitForMessage = (
    resolve: (value: T | PromiseLike<T>) => void,
    reject: (reason?: unknown) => void,
    timeout: number
  ): void => {
    this.resolve = resolve;
    this.reject = reject;
    this.timeout = setTimeout(
      () => reject({ error: 'lambda timeout' }),
      timeout
    );

    this.cp.on('message', this.receive);
  };

  public close = (): void => {
    this.cp.off('message', this.receive);
  };

  private receive = (data: Serializable): void => {
    if (!isWithRequestNumber(data)) {
      return;
    }

    if (data.requestNumber !== this.requestNumber) {
      return;
    }

    if (isLambdaError<T>(data)) {
      if (this.timeout) clearTimeout(this.timeout);
      if (this.reject) this.reject(data.error);
    }

    if (isLambdaResponse<T>(data)) {
      if (this.timeout) clearTimeout(this.timeout);
      if (this.resolve) this.resolve(data.result);
    }
  };
}
