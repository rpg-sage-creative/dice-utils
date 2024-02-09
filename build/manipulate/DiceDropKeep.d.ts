import { RollData } from "../types/RollData.js";
import type { TokenData, TokenParsers } from "../types/index.js";
export declare enum DiceDropKeepType {
    None = 0,
    DropLowest = 1,
    DropHighest = 2,
    KeepLowest = 3,
    KeepHighest = 4
}
/** The information about how many dice to drop or keep and how to display that in the output. */
export type DiceDropKeepData = {
    /** the fundamental action */
    type: DiceDropKeepType;
    /** how many dice we drop or keep */
    value: number;
    /** a human readable alternative for output */
    alias?: string;
};
export declare class DiceDropKeep {
    protected data?: DiceDropKeepData | undefined;
    constructor(data?: DiceDropKeepData | undefined);
    get alias(): string;
    get isEmpty(): boolean;
    get type(): DiceDropKeepType;
    get value(): number;
    /** Adjusts the count by removing any dice that were dropped. */
    adjustCount(count: number): number;
    /** Marks all rolls to be dropped as such. */
    markDropped(rolls: RollData[]): void;
    /** Adjusts the sum by removing any dice that were dropped. */
    adjustSum(values: number[]): number;
    toJSON(): DiceDropKeepData | undefined;
    /** Generates string output for the given DropKeepData */
    toString(leftPad?: string, rightPad?: string): string;
    /** The token key/regex used to generate DropKeepData */
    static getParsers(): TokenParsers;
    /** Parses the given TokenData into DropKeepData */
    static parseData(token?: TokenData | null): DiceDropKeepData | undefined;
    static from(token?: TokenData | null): DiceDropKeep;
}
