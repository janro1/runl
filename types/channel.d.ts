/// <reference types="node" />
import type { ChildProcess, Serializable } from 'child_process';
export declare class Channel<T> {
    private readonly cp;
    private readonly requestNumber;
    private timeout;
    private resolve;
    private reject;
    constructor(cp: ChildProcess, requestNumber: number);
    send: (data: Serializable) => void;
    waitForMessage: (resolve: (value: T | PromiseLike<T>) => void, reject: (reason?: unknown) => void, timeout: number) => void;
    close: () => void;
    private receive;
}
