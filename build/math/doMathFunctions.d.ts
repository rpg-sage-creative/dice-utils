type Options = {
    globalFlag?: boolean;
};
/** Returns a regular expression that finds:
 * min(...number[])
 * max(...number[])
 * floor(number)
 * ceil(number)
 * round(number)
 */
export declare function getMathFunctionRegex(options?: Options): RegExp;
/** Convenience for getMathFunctionRegex().test(value) */
export declare function hasMathFunctions(value: string): boolean;
/** Checks the value for min/max/floor/ceil/round and replaces it with the result. */
export declare function doMathFunctions(value: string): string;
export {};
