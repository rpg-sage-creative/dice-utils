import { DiceRollManipulator } from "../manipulate/DiceManipulator.js";
import type { DiceOperator } from "../types/DiceOperator.js";
import { DicePart, type DicePartCore, type TDicePart } from "./DicePart.js";
export type DicePartRollCore<GameType extends number = number, ObjectType extends string = "DicePartRoll", IdType extends string = string> = {
    dice: DicePartCore;
    gameType: GameType;
    id: IdType;
    objectType: ObjectType;
    rolls: number[];
};
export type TDicePartRoll = DicePartRoll<DicePartRollCore, TDicePart>;
export declare class DicePartRoll<Core extends DicePartRollCore<GameType, ObjectType, IdType>, Dice extends TDicePart = TDicePart, GameType extends number = number, ObjectType extends string = "DicePartRoll", IdType extends string = string> {
    protected core: Core;
    get objectType(): ObjectType;
    toJSON(): Core;
    get id(): IdType;
    constructor(core: Core);
    get gameType(): GameType;
    get sign(): DiceOperator | undefined;
    private _manipulation?;
    get manipulation(): DiceRollManipulator;
    get hasManipulation(): boolean;
    get total(): number;
    get isMax(): boolean;
    get isMin(): boolean;
    private _dice?;
    get dice(): Dice;
    get hasSecret(): boolean;
    /** The raw rolls. */
    get rolls(): number[];
    /** How many dice rolled 1. */
    get minCount(): number;
    /** How many dice rolled max (value equal to .dice.sides). */
    get maxCount(): number;
    protected static _createCore<Core extends DicePartRollCore>(dicePart: TDicePart): Core;
    protected static _createCore<Core extends DicePartRollCore, GameType extends number>(dicePart: TDicePart, gameType: GameType): Core;
    static create(dicePart: TDicePart): TDicePartRoll;
    static fromCore(core: DicePartRollCore): TDicePartRoll;
    static Dice: typeof DicePart;
}
