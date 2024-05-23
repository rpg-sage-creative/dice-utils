import { randomSnowflake } from "@rsc-utils/snowflake-utils";
import { DiceGroup } from "../../dice/DiceGroup.js";
import { DiceSecretMethodType } from "../../types/DiceSecretMethodType.js";
import { QuestDice } from "./QuestDice.js";
import { getTokenParsers } from "./internal/getTokenParsers.js";
export class QuestDiceGroup extends DiceGroup {
    static create(dice, args) {
        return new QuestDiceGroup({
            objectType: "DiceGroup",
            gameType: QuestDiceGroup.GameType,
            id: randomSnowflake(),
            children: dice.map(d => d.toJSON()),
            criticalMethodType: undefined,
            outputType: args?.outputType,
            secretMethodType: DiceSecretMethodType.Ignore,
        });
    }
    static getTokenParsers = getTokenParsers;
    static Child = QuestDice;
    static GameType = QuestDice.GameType;
}
