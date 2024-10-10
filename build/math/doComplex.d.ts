type Options = {
    /** include the global flag in the regex */
    gFlag?: "g" | "";
    /** include the case insensitive flag in the regex */
    iFlag?: "i" | "";
    /** are spoilers allowed or optional */
    spoilers?: boolean | "optional";
};
/** Returns a cached instance of the complex regex. */
export declare function getComplexRegex(options?: Options): RegExp;
/** Tests the value against a complex regex using the given options. */
export declare function hasComplex(value: string, options?: Omit<Options, "gFlag">): boolean;
/** Replaces all instances of min/max/floor/ceil/round with the resulting calculated value. */
export declare function doComplex(input: string, options?: Omit<Options, "gFlag">): string;
export {};
