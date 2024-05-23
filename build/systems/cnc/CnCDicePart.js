import { randomSnowflake } from "@rsc-utils/snowflake-utils";
import { cleanDicePartDescription } from "../../cleanDicePartDescription.js";
import { DicePart } from "../../dice/DicePart.js";
import { DiceTestType } from "../../DiceTest.js";
import { DiceExplode } from "../../manipulate/DiceExplode.js";
import { GameSystemType } from "../../types/GameSystemType.js";
import { reduceTokenToDicePartCore } from "./internal/reduceTokenToDicePartCore.js";
import { targetDataToTestData } from "./internal/targetDataToTestData.js";
export class CnCDicePart extends DicePart {
    static create({ count, description, target } = {}) {
        return new CnCDicePart({
            objectType: "DicePart",
            gameType: CnCDicePart.GameType,
            id: randomSnowflake(),
            children: undefined,
            count: count ?? 1,
            description: cleanDicePartDescription(description),
            fixedRolls: undefined,
            manipulation: [{ explode: new DiceExplode({ alias: "x", type: DiceTestType.Equal, value: 12 }) }],
            modifier: 0,
            sides: 12,
            sign: undefined,
            test: this.targetDataToTestData(target),
            target
        });
    }
    static reduceTokenToCore = reduceTokenToDicePartCore;
    static targetDataToTestData = targetDataToTestData;
    static GameType = GameSystemType.CnC;
}
