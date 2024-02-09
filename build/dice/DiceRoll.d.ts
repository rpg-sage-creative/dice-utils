import { HasIdCore, type IdCore } from "@rsc-utils/class-utils";
import { DieRollGrade } from "../grade.js";
import { DiceOutputType } from "../types/DiceOutputType.js";
import { Dice, type DiceCore, type TDice } from "./Dice.js";
import type { DicePartRollCore, TDicePartRoll } from "./DicePartRoll.js";
export interface DiceRollCore<GameType extends number = number> extends IdCore<"DiceRoll"> {
    dice: DiceCore;
    gameType: GameType;
    rolls: DicePartRollCore[];
}
export type TDiceRoll = DiceRoll<DiceRollCore, TDice, TDicePartRoll>;
export declare class DiceRoll<T extends DiceRollCore, U extends TDice, V extends TDicePartRoll> extends HasIdCore<T> {
    get grade(): DieRollGrade;
    get total(): number;
    get isMax(): boolean;
    get isMin(): boolean;
    private _dice?;
    get dice(): U;
    get hasSecret(): boolean;
    private _rolls?;
    get rolls(): V[];
    protected _toString(outputType: DiceOutputType, hideRolls: boolean): string;
    protected toStringXS(hideRolls: boolean): string;
    protected toStringXXS(hideRolls: boolean): string;
    toString(): string;
    toString(hideRolls: boolean): string;
    toString(outputType: DiceOutputType): string;
    toString(outputType: DiceOutputType, hideRolls: boolean): string;
    toString(hideRolls: boolean, outputType: DiceOutputType): string;
    static create(_dice: TDice, uuid: boolean): TDiceRoll;
    static fromCore(core: DiceRollCore): TDiceRoll;
    static Dice: typeof Dice;
}
