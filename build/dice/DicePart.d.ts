import { DiceTest, type DiceTestData } from "../DiceTest.js";
import { DiceManipulator, type DiceManipulationData } from "../manipulate/DiceManipulator.js";
import type { DiceOperator } from "../types/DiceOperator.js";
import { DiceOutputType } from "../types/DiceOutputType.js";
import { DiceBase, type DiceBaseCore } from "./DiceBase.js";
type DicePartCoreBase = {
    /** number of dice */
    count: number;
    /** description of dice or modifier */
    description: string;
    /** values to use instead of rolling */
    fixedRolls?: number[];
    /** the initially rolled values (before manipulation) */
    initialRolls?: number[];
    /** the final rolled values (after manipulation) */
    manipulatedRolls?: number[];
    /** do we have: dropKeep, explode, threshold ? ? ? */
    manipulation?: DiceManipulationData[];
    /** roll modifier */
    modifier: number;
    /** number of sides on the dice */
    sides: number;
    /** sign (- or +) of the dice or modifier */
    sign?: DiceOperator;
    /** target test information */
    test?: DiceTestData;
};
export type DicePartCoreArgs = Partial<DicePartCoreBase>;
export type DicePartCore<GameType extends number = number> = DicePartCoreBase & DiceBaseCore<never, "DicePart", GameType>;
export type TDicePart = DicePart<DicePartCore>;
export declare class DicePart<CoreType extends DicePartCore<GameType>, GameType extends number = number> extends DiceBase<CoreType, never, "DicePart", GameType> {
    get count(): number;
    get description(): string;
    get fixedRolls(): number[];
    get initialRolls(): number[];
    get manipulatedRolls(): number[];
    private _manipulation?;
    get manipulation(): DiceManipulator;
    get modifier(): number;
    get sides(): number;
    get sign(): DiceOperator | undefined;
    private _test?;
    get test(): DiceTest;
    get adjustedCount(): number;
    /** The biggest possible result. Simply totals max roll + modifier. */
    private get biggest();
    /** The maximum possible result. Accounts for negative numbers, thus -1d6 has max of -1 and min of -6. */
    get max(): number;
    /** How many dice rolled max (value equal to .dice.sides). */
    get maxCount(): number;
    /** The minimum possible result. Accounts for negative numbers, thus -1d6 has max of -1 and min of -6. */
    get min(): number;
    /** How many dice rolled 1. */
    get minCount(): number;
    /** The smallest possible result. Simply totals min roll + modifier. */
    private get smallest();
    get total(): number;
    get hasDescription(): boolean;
    get hasDie(): boolean;
    get hasManipulation(): boolean;
    get hasRolls(): boolean;
    get hasSecret(): boolean;
    get hasTest(): boolean;
    get isEmpty(): boolean;
    get isMax(): boolean;
    get isMin(): boolean;
    roll(): void;
    toDiceString(outputType?: DiceOutputType, index?: number): string;
    toRollString(): string;
    static create(args?: DicePartCoreArgs): TDicePart;
    static fromCore<CoreType, DiceType>(core: CoreType): DiceType;
}
export {};
