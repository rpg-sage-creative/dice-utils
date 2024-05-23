import { randomSnowflake } from "@rsc-utils/snowflake-utils";
import { DiceSecretMethodType } from "../../../types/DiceSecretMethodType.js";
import { DiceGroup } from "../../DiceGroup.js";
import { CnCDice } from "./CnCDice.js";
import { getCnCTokenParsers } from "./internal/getCnCTokenParsers.js";
export class CnCDiceGroup extends DiceGroup {
    static create(dice, args) {
        return new CnCDiceGroup({
            objectType: "DiceGroup",
            gameType: CnCDiceGroup.GameType,
            id: randomSnowflake(),
            children: dice.map(d => d.toJSON()),
            criticalMethodType: undefined,
            outputType: args?.outputType,
            secretMethodType: DiceSecretMethodType.Ignore,
        });
    }
    static getTokenParsers = getCnCTokenParsers;
    static Child = CnCDice;
    static GameType = CnCDice.GameType;
}
