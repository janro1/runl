import type { SerializableError } from '../types.js';

export const serializeError = (error: string | Error): SerializableError => ({
  message: typeof error === 'string' ? error : error.message,
  stack: typeof error === 'string' ? undefined : error.stack
});

export const deserializeError = (
  serializableError: SerializableError
): Error => {
  const error = new Error(serializableError.message);
  error.stack = serializableError.stack ?? undefined;

  return error;
};
