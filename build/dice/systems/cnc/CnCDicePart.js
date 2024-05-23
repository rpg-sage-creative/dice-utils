import { randomSnowflake } from "@rsc-utils/snowflake-utils";
import { cleanDicePartDescription } from "../../../cleanDicePartDescription.js";
import { DiceTestType } from "../../../DiceTest.js";
import { DiceExplode } from "../../../manipulate/DiceExplode.js";
import { GameSystemType } from "../../../types/GameSystemType.js";
import { DicePart } from "../../DicePart.js";
import { reduceTokenToCnCDicePartCore } from "./internal/reduceTokenToCnCDicePartCore.js";
import { targetDataToCnCTestData } from "./internal/targetDataToCnCTestData.js";
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
            test: CnCDicePart.targetDataToTestData(target),
            target
        });
    }
    static reduceTokenToCore = reduceTokenToCnCDicePartCore;
    static targetDataToTestData = targetDataToCnCTestData;
    static GameType = GameSystemType.CnC;
}
