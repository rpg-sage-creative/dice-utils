import { Dice, type DiceCore } from "../../dice/Dice.js";
import type { DiceBase } from "../../dice/DiceBase.js";
import type { GameSystemType } from "../../types/GameSystemType.js";
import { gradeRoll } from "./internal/gradeRoll.js";
import { gradeToEmoji } from "./internal/gradeToEmoji.js";
import { QuestDicePart } from "./QuestDicePart.js";
export declare class QuestDice extends Dice<DiceCore, QuestDicePart, GameSystemType> {
    static readonly Child: typeof DiceBase;
    static readonly GameType = GameSystemType.Quest;
    static readonly gradeRoll: typeof gradeRoll;
    static readonly gradeToEmoji: typeof gradeToEmoji;
}
