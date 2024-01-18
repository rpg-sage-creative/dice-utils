import type { TokenData, TokenParsers } from "@rsc-utils/string-utils";
import { DiceTestType } from "./DiceTest";
export type ExplodeDiceData = {
    alias: string;
    /** the fundamental action */
    type: DiceTestType;
    /** the value we explode (around) */
    value: number;
};
export declare class ExplodeDice {
    protected data?: ExplodeDiceData | undefined;
    constructor(data?: ExplodeDiceData | undefined);
    get alias(): string;
    get isEmpty(): boolean;
    get type(): DiceTestType;
    get value(): number;
    explode(dieSize: number, dieValues: number[]): number[];
    shouldExplode(value: number): boolean;
    toJSON(): ExplodeDiceData | undefined;
    /** Generates string output for the given ExplodeDiceData */
    toString(leftPad?: string, rightPad?: string): string;
    /** The token key/regex used to generate ExplodeDiceData */
    static getParsers(): TokenParsers;
    /** Parses the given TokenData into ExplodeDiceData */
    static parse(token: TokenData): ExplodeDiceData | undefined;
    static explode(dieSize: number, dieValues: number[]): number[];
}
