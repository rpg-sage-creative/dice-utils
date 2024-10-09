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
/** Returns a cached instance of the number regex. */
export declare function getNumberRegex(options?: Options): RegExp;
export {};
