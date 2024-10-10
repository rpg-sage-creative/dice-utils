type Options = {
    /** include the global flag in the regex */
    gFlag?: "g" | "";
    /** include the case insensitive flag in the regex */
    iFlag?: "i" | "";
    /** are spoilers allowed or optional */
    spoilers?: boolean | "optional";
};
/** Returns a cached instance of the simple math regex. */
export declare function getSimpleRegex(options?: Options): RegExp;
/** Tests the value against a simple math regex using the given options. */
export declare function hasSimple(value: string, options?: Omit<Options, "gFlag">): boolean;
/**
 * Replaces all instances of simple math with the resulting calculated value.
 * Valid math symbols: [-+/*%^] and spaces and numbers.
 * Any math resulting in null, undefined, or NaN will have "(NaN)" instead of a numeric result.
 * Any math that throws an error wille have "(ERR)" instead of a numeric result.
 */
export declare function doSimple(input: string, options?: Omit<Options, "gFlag">): string;
export {};
