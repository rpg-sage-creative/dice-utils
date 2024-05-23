import { randomSnowflake } from "@rsc-utils/snowflake-utils";
import { type TDice } from "../../../dice/Dice.js";
import { type DiceBase } from "../../../dice/DiceBase.js";
import { DiceGroup, type DiceGroupCore, type DiceGroupCoreArgs, type TDiceGroup } from "../../../dice/DiceGroup.js";
import { DiceSecretMethodType } from "../../../types/DiceSecretMethodType.js";
import type { GameSystemType } from "../../../types/GameSystemType.js";
import { QuestDice } from "./QuestDice.js";
import { getTokenParsers } from "./internal/getTokenParsers.js";

export class QuestDiceGroup extends DiceGroup<DiceGroupCore, QuestDice, GameSystemType> {

	public static create<DiceGroupType extends TDiceGroup, DiceType extends TDice>(dice: DiceType[], args?: DiceGroupCoreArgs): DiceGroupType {
		return new QuestDiceGroup({
			objectType: "DiceGroup",
			gameType: QuestDiceGroup.GameType,
			id: randomSnowflake(),

			children: dice.map(d => d.toJSON()),
			criticalMethodType: undefined!,
			outputType: args?.outputType,
			secretMethodType: DiceSecretMethodType.Ignore,
		}) as DiceGroupType;
	}

	public static readonly getTokenParsers = getTokenParsers;

	public static readonly Child = QuestDice as typeof DiceBase;

	public static readonly GameType = QuestDice.GameType;

}
