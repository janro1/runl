/* eslint-disable no-console */
import { LambdaContext } from './utils/context.js';
import { isOption, isWithEvent, isWithRequestNumber } from './types.js';
import { serializeError } from './utils/error.js';
const isValidOption = (options) => isOption(options) && isWithRequestNumber(options) && isWithEvent(options);
const getOptions = (rawOptions) => {
    const options = JSON.parse(rawOptions);
    if (!isValidOption(options)) {
        throw new Error('Unable to execute lambda handler, invalid options given.');
    }
    return options;
};
const isSerializeableError = (value) => value !== null && (typeof value === 'string' || value instanceof Error);
export const runLambda = async (loader) => {
    process.on('message', async (rawOptions) => {
        const options = getOptions(rawOptions);
        try {
            const handler = await loader(options);
            const context = new LambdaContext(options);
            const callback = (error, result) => {
                if (!process.send) {
                    console.error('process.send is undefined');
                    return;
                }
                process.send({
                    result: result ?? undefined,
                    error: error ? serializeError(error) : undefined,
                    requestNumber: options.requestNumber
                });
            };
            const resultPromise = handler(options.event, context, callback);
            if (!resultPromise || !resultPromise.then) {
                return;
            }
            if (!process.send) {
                console.error('process.send is undefined');
                return;
            }
            const result = await resultPromise;
            process.send({
                result,
                requestNumber: options.requestNumber
            });
        }
        catch (e) {
            if (process.send && isSerializeableError(e)) {
                process.send({
                    error: serializeError(e),
                    requestNumber: options.requestNumber
                });
            }
            else {
                console.error('Unable to execute Lambda', e);
            }
        }
    });
    process.stdin.resume();
};
