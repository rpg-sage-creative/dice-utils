import { Dice } from "../../../dice/Dice.js";
import { gradeRoll } from "./internal/gradeRoll.js";
import { gradeToEmoji } from "./internal/gradeToEmoji.js";
import { QuestDicePart } from "./QuestDicePart.js";
export class QuestDice extends Dice {
    static Child = QuestDicePart;
    static GameType = QuestDicePart.GameType;
    static gradeRoll = gradeRoll;
    static gradeToEmoji = gradeToEmoji;
}
