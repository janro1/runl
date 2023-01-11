const isObject = (value) => value !== null && typeof value === 'object';
const isHandler = (value) => value !== null && typeof value === 'function';
const getHandler = async (lambdaModule, lambdaHandler) => {
    const handler = lambdaModule[lambdaHandler];
    if (isHandler(handler)) {
        return Promise.resolve(handler);
    }
    return Promise.reject(`exported ${lambdaHandler} is not a function`);
};
export const createLambdaLoader = (moduleLoader) => async (options) => {
    const lambdaHandler = options.lambdaHandler || 'handler';
    try {
        const lambdaModule = await moduleLoader(options.lambdaPath);
        if (!isObject(lambdaModule)) {
            return Promise.reject(`Unable to load lambda handler from ${options.lambdaPath}`);
        }
        if (lambdaHandler in lambdaModule) {
            return getHandler(lambdaModule, lambdaHandler);
        }
        if ('default' in lambdaModule &&
            isObject(lambdaModule.default) &&
            lambdaHandler in lambdaModule.default) {
            return getHandler(lambdaModule.default, lambdaHandler);
        }
        return Promise.reject(`lambdaHandler ${lambdaHandler} is not exported!`);
    }
    catch (e) {
        const message = e instanceof Error ? e.message : JSON.stringify(e);
        return Promise.reject(`Unable to require lambda handler from ${options.lambdaPath}. Reason: ${message}`);
    }
};
