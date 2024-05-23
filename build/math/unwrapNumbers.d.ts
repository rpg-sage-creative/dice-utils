type Options = {
    globalFlag?: boolean;
};
/** Returns a regular expression that finds a number wrapped in parentheses */
export declare function getWrappedNumberRegex(options?: Options): RegExp;
/** Convenience for getWrappedNumberRegex().test(value) */
export declare function hasWrappedNumbers(value: string): boolean;
/**
 * Unlike other doX functions, we only run this once; to avoid breaking the other functions.
 * ex: round((10)) becomes round(10) and not round10
 */
export declare function unwrapNumbers(value: string): string;
export {};
