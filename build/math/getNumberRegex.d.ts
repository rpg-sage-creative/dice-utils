type Options = {
    /** require the value to be "anchored" to start/end of the string */
    anchored?: boolean;
    /** capture the number, optionally with a capture group */
    capture?: string;
    /** include the global flag in the regex */
    gFlag?: "g" | "";
    /** include the case insensitive flag in the regex */
    iFlag?: "i" | "";
    /** are spoilers allowed or optional */
    spoilers?: boolean | "optional";
};
/**
 * Returns an instance of the number regexp.
 * If gFlag is passed, a new regexp is created.
 * If gFlag is not passed, a cached version of the regexp is used.
 */
export declare function getNumberRegex(options?: Options): RegExp;
export {};
