/**
 * Returns an array of non-unique random values from the array.
 * @param array array of values to select from
 * @param count number of random values to choose
 */
export declare function randomItems<T>(array: T[], count: number): T[];
/**
 * Returns an array of random values from the array.
 * @param array array of values to select from
 * @param count number of random values to choose
 * @param unique if true, the same value (using .includes) will not be selected twice
 */
export declare function randomItems<T>(array: T[], count: number, unique: boolean): T[];
