import { randomSnowflake } from "@rsc-utils/snowflake-utils";
import { cleanDicePartDescription } from "../../cleanDicePartDescription.js";
import { DicePart, type DicePartCore, type DicePartCoreArgs, type TDicePart } from "../../dice/DicePart.js";
import { GameSystemType } from "../../types/GameSystemType.js";
import type { TargetType } from "./internal/TargetType.js";
import { reduceTokenToDicePartCore } from "./internal/reduceTokenToDicePartCore.js";
import { targetDataToTestData } from "./internal/targetDataToTestData.js";

export class QuestDicePart extends DicePart<DicePartCore<TargetType>, TargetType, GameSystemType> {

	public static create<DicePartType extends TDicePart>({ description, target }: DicePartCoreArgs = {}): DicePartType {
		return new QuestDicePart({
			objectType: "DicePart",
			gameType: QuestDicePart.GameType,
			id: randomSnowflake(),

			children: undefined!,
			count: 1,
			description: cleanDicePartDescription(description),
			fixedRolls: undefined!,
			manipulation: undefined!,
			modifier: 0,
			sides: 20,
			sign: undefined!,
			test: QuestDicePart.targetDataToTestData(target),
			target
		}) as DicePartType;
	}

	public static readonly reduceTokenToCore = reduceTokenToDicePartCore;

	public static readonly targetDataToTestData = targetDataToTestData;

	public static readonly GameType = GameSystemType.Quest;
}
