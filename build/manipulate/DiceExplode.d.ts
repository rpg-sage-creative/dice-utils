import { DiceTestType } from "../DiceTest.js";
import type { TokenData, TokenParsers } from "../types/index.js";
export type DiceExplodeData = {
    alias: string;
    /** the fundamental action */
    type: DiceTestType;
    /** the value we explode (around) */
    value: number;
};
export declare class DiceExplode {
    protected data?: DiceExplodeData | undefined;
    constructor(data?: DiceExplodeData | undefined);
    get alias(): string;
    get isEmpty(): boolean;
    get type(): DiceTestType;
    get value(): number;
    explode(dieSize: number, dieValues: number[]): number[];
    shouldExplode(value: number): boolean;
    toJSON(): DiceExplodeData | undefined;
    /** Generates string output for the given DiceExplodeData */
    toString(leftPad?: string, rightPad?: string): string;
    /** The token key/regex used to generate DiceExplodeData */
    static getParsers(): TokenParsers;
    /** Parses the given TokenData into DiceExplodeData */
    static parseData(token: TokenData): DiceExplodeData | undefined;
    static from(token: TokenData): DiceExplode;
    static explode(dieSize: number, dieValues: number[]): number[];
}
