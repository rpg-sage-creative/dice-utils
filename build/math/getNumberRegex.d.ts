type Options = {
    allowSpoilers?: boolean;
    globalFlag?: boolean;
};
/** A reusable way to get proper regex for a valid +/- integer or decimal. */
export declare function getNumberRegex(options?: Options): RegExp;
export {};
