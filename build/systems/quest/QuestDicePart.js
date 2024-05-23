import { randomSnowflake } from "@rsc-utils/snowflake-utils";
import { cleanDicePartDescription } from "../../cleanDicePartDescription.js";
import { DicePart } from "../../dice/DicePart.js";
import { GameSystemType } from "../../types/GameSystemType.js";
import { reduceTokenToDicePartCore } from "./internal/reduceTokenToDicePartCore.js";
import { targetDataToTestData } from "./internal/targetDataToTestData.js";
export class QuestDicePart extends DicePart {
    static create({ description, target } = {}) {
        return new QuestDicePart({
            objectType: "DicePart",
            gameType: QuestDicePart.GameType,
            id: randomSnowflake(),
            children: undefined,
            count: 1,
            description: cleanDicePartDescription(description),
            fixedRolls: undefined,
            manipulation: undefined,
            modifier: 0,
            sides: 20,
            sign: undefined,
            test: QuestDicePart.targetDataToTestData(target),
            target
        });
    }
    static reduceTokenToCore = reduceTokenToDicePartCore;
    static targetDataToTestData = targetDataToTestData;
    static GameType = GameSystemType.Quest;
}
