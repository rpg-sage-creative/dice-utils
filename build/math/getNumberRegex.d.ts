type Options = {
    /** include a number wrapped in discord spoiler tags, ex: ||1|| */
    allowSpoilers?: boolean;
    /** require the value to be "anchored" to start/end of the string */
    anchored?: boolean;
    /** capture the number, optionally with a capture group */
    capture?: boolean | string;
    /** include the global flag in the regex */
    globalFlag?: boolean;
};
/** A reusable way to get proper regex for a valid +/- integer or decimal. */
export declare function getNumberRegex(options?: Options): RegExp;
export {};
