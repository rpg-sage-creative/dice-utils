import { gradeToEmoji } from "../../../grade.js";
import type { GameSystemType } from "../../../types/GameSystemType.js";
import { Dice, type DiceCore } from "../../Dice.js";
import type { DiceBase } from "../../DiceBase.js";
import { CnCDicePart } from "./CnCDicePart.js";
export declare class CnCDice extends Dice<DiceCore, CnCDicePart, GameSystemType> {
    toRollString(): string;
    static readonly Child: typeof DiceBase;
    static readonly GameType = GameSystemType.CnC;
    static readonly gradeRoll: () => number;
    static readonly gradeToEmoji: typeof gradeToEmoji;
}
