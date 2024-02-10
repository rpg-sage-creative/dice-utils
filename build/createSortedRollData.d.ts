import type { TDicePart } from "./dice/DicePart.js";
import type { RollData } from "./types/RollData.js";
/** Contains the Roll Data length and sorted arrays. */
type SortedRollData = {
    /** Sorted by index */
    byIndex: RollData[];
    /** Sorted by roll (value/result) */
    byRoll: RollData[];
    /** Number of RollData objects */
    length: number;
};
/** Creates the SortedRollData used to generate formatted dice output. */
export declare function createSortedRollData(dicePart: TDicePart, markDropped?: boolean): SortedRollData;
export {};
