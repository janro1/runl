import type { SerializableError } from '../types.js';
export declare const serializeError: (error: string | Error) => SerializableError;
export declare const deserializeError: (serializableError: SerializableError) => Error;
