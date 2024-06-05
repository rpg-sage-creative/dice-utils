/** Attempts to do the math and returns true if the result was not null. */
export declare function isSimple(value: string): boolean;
/**
 * Ensures the value has only mathematical characters before performing an eval to get the math results.
 * Valid math symbols: ^/*+- and spaces and numbers.
 * Returns null if the value isn't simple math or an error occurred during eval().
 */
export declare function doSimple(value: string): string | null;
