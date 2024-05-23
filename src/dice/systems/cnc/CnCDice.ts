import { cleanWhitespace } from "@rsc-utils/string-utils";
import { gradeToEmoji } from "../../../grade.js";
import { UNICODE_LEFT_ARROW } from "../../../types/consts.js";
import type { GameSystemType } from "../../../types/GameSystemType.js";
import { Dice, type DiceCore } from "../../Dice.js";
import type { DiceBase } from "../../DiceBase.js";
import { CnCDicePart } from "./CnCDicePart.js";
import { gradeRoll } from "./internal/gradeRoll.js";

export class CnCDice extends Dice<DiceCore, CnCDicePart, GameSystemType> {
	public toRollString(): string {
		const sortedRollData = this.primary?.sortedRollData;
		const baseCount = sortedRollData?.initialCount ?? 0;
		const baseValues = sortedRollData?.byIndex.slice(0, baseCount).map(r => r.value) ?? [];
		const critValues = sortedRollData?.byIndex.slice(baseCount).map(r => r.value) ?? [];
		const vs = this.test?.value ?? 8;
		const vsOutput = vs !== 8 ? ` vs ${vs} ` : ``;
		const [grade, gradeValues] = gradeRoll(baseValues, critValues, vs);
		const gradeOutput = gradeToEmoji(grade);
		const baseOutput = ` [${baseValues.join(",")}]${baseValues.length}d12 ${vsOutput} (**${gradeValues[0]}**)`;
		const critOutput = critValues.length ? ` + [${critValues.join(",")}]${critValues.length}d12 ${vsOutput} (**${gradeValues[5]}**)` : ``;
		const totalSuccesses = critValues.length ? ` -> **${gradeValues[0] + gradeValues[5]}**` : ``;
		const desc = this.children.find(dp => dp.hasDescription)?.description;
		const descOutput = desc ? "`" + desc + "`" : "";
		return cleanWhitespace(`${gradeOutput} ${descOutput} ${UNICODE_LEFT_ARROW} ${baseOutput} ${critOutput} ${totalSuccesses}`);
	}

	public static readonly Child = CnCDicePart as typeof DiceBase;

	public static readonly GameType = CnCDicePart.GameType;

	// We shouldn't be using this, but just in case let's return 0.
	public static readonly gradeRoll = () => 0;

	public static readonly gradeToEmoji = gradeToEmoji;
}