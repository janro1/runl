export const serializeError = (error) => ({
    message: typeof error === 'string' ? error : error.message,
    stack: typeof error === 'string' ? undefined : error.stack
});
export const deserializeError = (serializableError) => {
    const error = new Error(serializableError.message);
    error.stack = serializableError.stack ?? undefined;
    return error;
};
