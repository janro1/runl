/* eslint-disable no-console */
import { fork } from 'child_process';
import { lastModified } from './utils/last-modified.js';
import { createExecArgv } from './utils/create-exec-argv.js';
import { LambdaMode } from './types.js';
import { Channel } from './channel.js';
export { LambdaMode };
export class LambdaBase {
    cp;
    lastUpdated;
    requestCount = 0;
    lambdaWrapperPath;
    options;
    constructor(options) {
        this.options = {
            ...options,
            lambdaPath: options.lambdaPath
        };
    }
    init = () => {
        if (this.options.mode === LambdaMode.Ephemeral) {
            console.warn('init() called with no effect. Lambda mode is ephemeral.');
            return;
        }
        if (this.cp) {
            return;
        }
        this.cp = this.createFork();
    };
    execute = async (event) => {
        const requestNumber = this.newRequestNumber();
        const cp = this.options.mode === LambdaMode.Ephemeral
            ? this.createFork()
            : this.getOrCreateFork();
        const channel = new Channel(cp, requestNumber);
        channel.send({
            ...this.options,
            event: event ?? {},
            requestNumber
        });
        return new Promise((resolve, reject) => {
            channel.waitForMessage(resolve, reject, this.options.lambdaTimeout || 30000);
        }).finally(() => {
            channel.close();
            if (this.options.mode === LambdaMode.Ephemeral) {
                cp.kill();
            }
        });
    };
    stop = () => {
        this.cp?.kill();
        if (this.cp?.killed) {
            this.cp = undefined;
        }
    };
    createFork = () => {
        const lambdaWrapperPath = this.getLambdaWrapperPath();
        const cp = fork(lambdaWrapperPath, {
            execArgv: createExecArgv({
                ...this.options,
                lambdaPath: this.absoluteLambdaHandlerPath()
            }),
            env: {
                ...(this.options.environment ?? {})
            }
        });
        this.lastUpdated = lastModified(this.options.lambdaPath);
        return cp;
    };
    getOrCreateFork = () => {
        if (!this.cp) {
            this.cp = this.createFork();
        }
        if (!this.isForkUpToDate()) {
            this.cp.kill();
            this.cp = this.createFork();
        }
        return this.cp;
    };
    newRequestNumber = () => ++this.requestCount;
    getLambdaWrapperPath = () => {
        if (this.lambdaWrapperPath) {
            return this.lambdaWrapperPath;
        }
        const lambdaWrapperPath = this.findLambdaWrapperPath();
        if (!lambdaWrapperPath) {
            throw new Error('Unable to load lambda wrapper');
        }
        this.lambdaWrapperPath = lambdaWrapperPath;
        return lambdaWrapperPath;
    };
    isForkUpToDate = () => {
        if (!this.options.autoReload) {
            return true;
        }
        return lastModified(this.options.lambdaPath) === this.lastUpdated;
    };
}
