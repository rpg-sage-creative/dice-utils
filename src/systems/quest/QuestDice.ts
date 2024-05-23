import { Dice, type DiceCore } from "../../dice/Dice.js";
import type { DiceBase } from "../../dice/DiceBase.js";
import type { GameSystemType } from "../../types/GameSystemType.js";
import { gradeRoll } from "./internal/gradeRoll.js";
import { gradeToEmoji } from "./internal/gradeToEmoji.js";
import { QuestDicePart } from "./QuestDicePart.js";

export class QuestDice extends Dice<DiceCore, QuestDicePart, GameSystemType> {

	public static readonly Child = QuestDicePart as typeof DiceBase;

	public static readonly GameType = QuestDicePart.GameType

	public static readonly gradeRoll = gradeRoll;

	public static readonly gradeToEmoji = gradeToEmoji;
}
