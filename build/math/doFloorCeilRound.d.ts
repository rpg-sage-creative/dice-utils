type Options = {
    globalFlag?: boolean;
};
/** Returns a regular expression that finds: floor(number) or ceil(number) or round(number) */
export declare function getFloorCeilRoundRegex(options?: Options): RegExp;
/** Convenience for getFloorCeilRoundRegex().test(value) */
export declare function hasFloorCeilRound(value: string): boolean;
/** Checks the value for floor(number) or ceil(number) or round(number) and replaces it with the result. */
export declare function doFloorCeilRound(value: string): string;
export {};
