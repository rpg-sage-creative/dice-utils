type Options = {
    globalFlag?: boolean;
};
/** Returns a regular expression that finds: min(...number[]) or max(...number[]) */
export declare function getMinMaxRegex(options?: Options): RegExp;
/** Convenience for getMinMaxRegex().test(value) */
export declare function hasMinMax(value: string): boolean;
/** Checks the value for min(...number[]) or max(...number[]) and replaces it with the result. */
export declare function doMinMax(value: string): string;
export {};
