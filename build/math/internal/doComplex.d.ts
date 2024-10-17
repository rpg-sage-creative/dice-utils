import { type RegExpGetOptions, type RegExpSpoilerOptions } from "@rsc-utils/core-utils";
type GetOptions = RegExpGetOptions & RegExpSpoilerOptions;
/** Tests the value against a complex regex using the given options. */
export declare function hasComplex(value: string, options?: GetOptions): boolean;
/** Replaces all instances of min/max/floor/ceil/round with the resulting calculated value. */
export declare function doComplex(input: string, options?: GetOptions): string;
export {};
