import { DiceTest } from "../DiceTest.js";
import { DieRollGrade } from "../grade.js";
import { DiceOutputType } from "../types/DiceOutputType.js";
import { DiceBase, type DiceBaseCore } from "./DiceBase.js";
import { type DicePartCore, type TDicePart } from "./DicePart.js";
type DiceCoreBase = {
    children: DicePartCore[];
};
export type DiceCore<GameType extends number = number> = DiceCoreBase & DiceBaseCore<DicePartCore, "Dice", GameType>;
export type TDice = Dice<DiceCore, TDicePart>;
export declare class Dice<CoreType extends DiceCore<GameType>, ChildType extends TDicePart, GameType extends number = number> extends DiceBase<CoreType, ChildType, "Dice", GameType> {
    /** The first dicePart with a die, typically a d20. */
    get primary(): ChildType | undefined;
    /** Sums the max of all the dice parts. */
    get max(): number;
    /** Sums the min of all the dice parts. */
    get min(): number;
    /** Gets the first test. */
    get test(): DiceTest;
    get grade(): DieRollGrade;
    get total(): number;
    get hasFixed(): boolean;
    get hasRolls(): boolean;
    get isD20(): boolean;
    get isEmpty(): boolean;
    get isMax(): boolean;
    get isMin(): boolean;
    toDiceString(_outputType?: DiceOutputType): string;
    protected _toRollString(outputType: DiceOutputType, hideRolls: boolean): string;
    protected toRollStringXS(hideRolls: boolean): string;
    protected toRollStringXXS(hideRolls: boolean): string;
    toRollString(...args: (boolean | DiceOutputType)[]): string;
    static create<DiceType extends TDice, DicePartType extends TDicePart>(diceParts: DicePartType[]): DiceType;
    static fromCore<CoreType extends DiceCore, DiceType extends TDice>(core: CoreType): DiceType;
    static readonly Child: typeof DiceBase;
    static correctEscapeForEmoji: (diceOutput: string) => string;
}
export {};
