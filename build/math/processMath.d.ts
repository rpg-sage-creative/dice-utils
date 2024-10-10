type Options = {
    /** include the case insensitive flag in the regex */
    iFlag?: "i" | "";
    /** are spoilers allowed or optional */
    spoilers?: boolean | "optional";
};
/** Checks to see if the value it matches any of the "doMath" functions. */
export declare function hasMath(value: string, options?: Options): boolean;
/** Processes the value against the "doMath" functions until none are found. */
export declare function processMath(value: string, options?: Options): string;
export {};
