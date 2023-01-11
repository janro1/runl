const isInspectArg = (arg) => arg.startsWith('inspect') || arg.startsWith('--inspect');
const isInspectSetViaEnv = () => {
    const nodeEnv = process.env['NODE_OPTIONS'] || process.env['NODE'];
    return nodeEnv ? nodeEnv.split('--').some(isInspectArg) : false;
};
const isInspectSetViaArg = () => process.execArgv.some(isInspectArg);
export const createExecArgv = (options) => {
    if (options.debugPort) {
        if (isInspectSetViaArg()) {
            return process.execArgv.map((arg) => isInspectArg(arg) ? `--inspect=${options.debugPort}` : arg);
        }
        if (isInspectSetViaEnv()) {
            process.execArgv.push(`--inspect=${options.debugPort}`);
            return process.execArgv;
        }
    }
    return process.execArgv;
};
