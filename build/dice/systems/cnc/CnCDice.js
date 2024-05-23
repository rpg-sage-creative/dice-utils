import { cleanWhitespace } from "@rsc-utils/string-utils";
import { gradeToEmoji } from "../../../grade.js";
import { UNICODE_LEFT_ARROW } from "../../../types/consts.js";
import { Dice } from "../../Dice.js";
import { CnCDicePart } from "./CnCDicePart.js";
import { gradeCnCRoll } from "./internal/gradeCnCRoll.js";
export class CnCDice extends Dice {
    toRollString() {
        const sortedRollData = this.primary?.sortedRollData;
        const baseCount = sortedRollData?.initialCount ?? 0;
        const baseValues = sortedRollData?.byIndex.slice(0, baseCount).map(r => r.value) ?? [];
        const critValues = sortedRollData?.byIndex.slice(baseCount).map(r => r.value) ?? [];
        const vs = this.test?.value ?? 8;
        const vsOutput = vs !== 8 ? ` vs ${vs} ` : ``;
        const [grade, gradeValues] = gradeCnCRoll(baseValues, critValues, vs);
        const gradeOutput = gradeToEmoji(grade);
        const baseOutput = ` [${baseValues.join(",")}]${baseValues.length}d12 ${vsOutput} (**${gradeValues[0]}**)`;
        const critOutput = critValues.length ? ` + [${critValues.join(",")}]${critValues.length}d12 ${vsOutput} (**${gradeValues[5]}**)` : ``;
        const totalSuccesses = critValues.length ? ` -> **${gradeValues[0] + gradeValues[5]}**` : ``;
        const desc = this.children.find(dp => dp.hasDescription)?.description;
        const descOutput = desc ? "`" + desc + "`" : "";
        return cleanWhitespace(`${gradeOutput} ${descOutput} ${UNICODE_LEFT_ARROW} ${baseOutput} ${critOutput} ${totalSuccesses}`);
    }
    static Child = CnCDicePart;
    static GameType = CnCDicePart.GameType;
    static gradeRoll = () => 0;
    static gradeToEmoji = gradeToEmoji;
}
