import type { TokenData, TokenParsers } from "./internal/tokenize.js";
export declare enum DiceTestType {
    None = 0,
    Equal = 1,
    GreaterThan = 2,
    GreaterThanOrEqual = 3,
    LessThan = 4,
    LessThanOrEqual = 5
}
/** The information about how to test dice results for success/failure and how to display that in the output. */
export type DiceTestData<Type extends number = DiceTestType> = {
    /** a human readable alternative output */
    alias?: string;
    /** wether or not this test should be hidden */
    hidden: boolean;
    /** the fundamental test */
    type: Type;
    /** the value to test against */
    value: number;
};
type DiceTestTargetValue = {
    /** is the value hidden from players? */
    hidden: boolean;
    /** the actual value */
    value: number;
};
/** Finds the DiceTestType for the given matched value from the RegExp */
export declare function parseDiceTestType(matchValue: string): DiceTestType;
export declare function parseDiceTestTargetValue(rawValue: string): DiceTestTargetValue;
export type HasDiceTestData = {
    test?: DiceTestData;
};
export type HasDiceTest = {
    test?: DiceTest;
    hasTest: boolean;
};
export declare function appendTestToCore(core: HasDiceTestData, token: TokenData, _index: number, _tokens: TokenData[]): boolean;
export declare class DiceTest {
    protected data?: DiceTestData<DiceTestType> | undefined;
    constructor(data?: DiceTestData<DiceTestType> | undefined);
    get alias(): string;
    get isHidden(): boolean;
    get isEmpty(): boolean;
    get type(): DiceTestType;
    get value(): number;
    /** Tests the value for pass/fail. If isEmpty, undefined is returned instead. */
    test(total: number): boolean | undefined;
    toJSON(): DiceTestData<DiceTestType> | undefined;
    toString(leftPad?: string, rightPad?: string): string;
    /** The token key/regex used to generate DiceTestData */
    static getParsers(): TokenParsers;
    static createData(type: DiceTestType, value: number, hidden: boolean, alias?: string): DiceTestData;
    /** Parses the given TokenData into DiceTestData */
    static parseData(token: TokenData): DiceTestData | undefined;
    /** Parses the given TokenData into DiceTestData */
    static from(token: TokenData): DiceTest;
    static readonly EmptyTest: DiceTest;
}
export {};
