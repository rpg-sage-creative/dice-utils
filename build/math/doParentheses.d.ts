type Options = {
    globalFlag?: boolean;
};
/**
 * Returns a regular expression that finds parentheses with simple math in them.
 * @todo alter the regex to explicitly find math instead of hoping we are good enough, this part: [^\\d.()]
 */
export declare function getParenthesesRegex(options?: Options): RegExp;
/** Convenience for getParenthesesRegex().test(value) */
export declare function hasParentheses(value: string): boolean;
/**
 * Unlike other doX functions, we only run this once; to avoid breaking the other functions.
 * Finds parentheses with math in them and replaces them with the result of doSimple(match).
 */
export declare function doParentheses(value: string): string;
export {};
