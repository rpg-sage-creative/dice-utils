type Options = {
    allowSpoilers?: boolean;
    globalFlag?: boolean;
};
/** Returns a regular expression that finds:
 * min(...number[])
 * max(...number[])
 * floor(number)
 * ceil(number)
 * round(number)
 */
export declare function getComplexRegex(options?: Options): RegExp;
/** Convenience for getMathFunctionRegex().test(value) */
export declare function hasComplex(value: string, options?: Omit<Options, "globalFlag">): boolean;
/** Checks the value for min/max/floor/ceil/round and replaces it with the result. */
export declare function doComplex(input: string, options?: Omit<Options, "globalFlag">): string;
export {};
