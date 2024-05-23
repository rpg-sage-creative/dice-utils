import { DiceTestType } from "../DiceTest.js";
import type { TokenData, TokenParsers } from "../internal/tokenize.js";
import type { RollData } from "../types/RollData.js";
import { DiceManipulation } from "./DiceManipulation.js";
export type DiceExplodeData = {
    alias: string;
    /** the fundamental action */
    type: DiceTestType;
    /** the value we explode (around) */
    value: number;
};
export declare class DiceExplode extends DiceManipulation<DiceExplodeData> {
    get alias(): string;
    get type(): DiceTestType;
    get value(): number;
    manipulateRolls(rolls: RollData[]): RollData[];
    shouldExplode(value: number): boolean;
    /** Generates string output for the given DiceExplodeData */
    toString(leftPad?: string, rightPad?: string): string;
    /** The token key/regex used to generate DiceExplodeData */
    static getParsers(): TokenParsers;
    /** Parses the given TokenData into DiceExplodeData */
    static parseData(token: TokenData, dieSize?: number): DiceExplodeData | undefined;
    static explode(dieSize: number, dieValues: number[]): number[];
}
