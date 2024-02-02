import type { TokenData, TokenParsers } from "./types/index.js";
import type { DiceRoll } from "./types/DiceRoll.js";
export declare enum DiceTestType {
    None = 0,
    Equal = 1,
    GreaterThan = 2,
    GreaterThanOrEqual = 3,
    LessThan = 4,
    LessThanOrEqual = 5
}
/** The information about how to test dice results for success/failure and how to display that in the output. */
export type DiceTestData = {
    /** a human readable alternative output */
    alias?: string;
    /** wether or not this test should be hidden */
    hidden: boolean;
    /** the fundamental test */
    type: DiceTestType;
    /** the value to test against */
    value: number;
};
export declare class DiceTest {
    protected data?: DiceTestData | undefined;
    constructor(data?: DiceTestData | undefined);
    get alias(): string;
    get isEmpty(): boolean;
    get type(): DiceTestType;
    get value(): number;
    /** Tests the value for pass/fail. If isEmpty, undefined is returned instead. */
    test(total: number): boolean | undefined;
    toJSON(): DiceTestData | undefined;
    /** The token key/regex used to generate DiceTestData */
    static getParsers(): TokenParsers;
    /** Parses the given TokenData into DiceTestData */
    static parse(token: TokenData): DiceTestData | undefined;
    static create(type: DiceTestType, value: number, hidden: boolean, alias?: string): DiceTestData;
    /** Tests the roll for pass/fail. If isEmpty, undefined is returned instead. */
    static test(roll: DiceRoll): boolean | undefined;
}
