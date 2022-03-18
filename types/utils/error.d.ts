import type { SerializableError } from '../types';
export declare const serializeError: (error: string | Error) => SerializableError;
export declare const deserializeError: (serializableError: SerializableError) => Error;
