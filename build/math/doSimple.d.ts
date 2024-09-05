import { type Optional } from "@rsc-utils/core-utils";
type Options = {
    anchored?: boolean;
};
/** Returns a regular expression that finds tests for only simple math operations. */
export declare function getSimpleRegex(options?: Options): RegExp;
/** Attempts to do the math and returns true if the result was not null. */
export declare function isSimple(value: string): boolean;
/**
 * Ensures the value has only mathematical characters before performing an eval to get the math results.
 * Valid math symbols: ^/*+- and spaces and numbers.
 * Returns undefined if the value isn't simple math.
 * Returns null if an error occurred during eval().
 */
export declare function doSimple(value: string): Optional<string>;
export {};
