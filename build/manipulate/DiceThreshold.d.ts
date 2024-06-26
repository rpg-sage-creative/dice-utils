import type { Optional } from "@rsc-utils/core-utils";
import type { TokenData, TokenParsers } from "../internal/tokenize.js";
import type { RollData } from "../types/RollData.js";
import { DiceManipulation } from "./DiceManipulation.js";
export declare enum DiceThresholdType {
    None = 0,
    BottomThreshold = 1,
    TopThreshold = 2
}
/** The information about how manipulate rolls to meet the threshold. */
export type DiceThresholdData = {
    /** the fundamental action */
    type: DiceThresholdType;
    /** the value used for the threshold */
    value: number;
    /** a human readable alternative for output */
    alias?: string;
};
export declare class DiceThreshold extends DiceManipulation<DiceThresholdData> {
    get alias(): string;
    get type(): DiceThresholdType;
    get value(): number;
    manipulateRolls(rolls: RollData[]): void;
    shouldUpdate(value: number): boolean;
    toJSON(): DiceThresholdData | undefined;
    /** Generates string output for the given DiceExplodeData */
    toString(leftPad?: string, rightPad?: string): string;
    /** The token key/regex used to generate ThresholdData */
    static getParsers(): TokenParsers;
    /** Parses the given TokenData into ThresholdData */
    static parseData(token: Optional<TokenData>): DiceThresholdData | undefined;
}
