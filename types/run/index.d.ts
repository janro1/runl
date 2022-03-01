import { Options } from '../types';
export declare type runProps = {
    execute: <T>(options: Options) => Promise<T>;
    stop: () => void;
};
export declare const run: () => runProps;
