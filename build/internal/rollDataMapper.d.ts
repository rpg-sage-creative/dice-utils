import type { RollData } from "../types/RollData.js";
/** Creates the RollData used to markup die roll output. */
export declare function rollDataMapper(roll: number, index: number, sides: number, isFixed: boolean): RollData;
