/**
 * Ensures the value has only mathematical characters before performing an eval to get the math results.
 * Valid characters: ()+-/*^ and spaces and numbers
 */
export declare function doMath(noBraces: string): string | null;
