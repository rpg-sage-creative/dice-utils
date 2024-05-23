import { randomSnowflake } from "@rsc-utils/snowflake-utils";
import { DiceSecretMethodType } from "../../../types/DiceSecretMethodType.js";
import { GameSystemType } from "../../../types/GameSystemType.js";
import type { TDice } from "../../Dice.js";
import type { DiceBase } from "../../DiceBase.js";
import { DiceGroup, type DiceGroupCore, type DiceGroupCoreArgs, type TDiceGroup } from "../../DiceGroup.js";
import { CnCDice } from "./CnCDice.js";
import { getTokenParsers } from "./internal/getTokenParsers.js";

export class CnCDiceGroup extends DiceGroup<DiceGroupCore, CnCDice, GameSystemType> {

	public static create<DiceGroupType extends TDiceGroup, DiceType extends TDice>(dice: DiceType[], args?: DiceGroupCoreArgs): DiceGroupType {
		return new CnCDiceGroup({
			objectType: "DiceGroup",
			gameType: CnCDiceGroup.GameType,
			id: randomSnowflake(),

			children: dice.map(d => d.toJSON()),
			criticalMethodType: undefined!,
			outputType: args?.outputType,
			secretMethodType: DiceSecretMethodType.Ignore,
		}) as DiceGroupType;
	}

	public static readonly getTokenParsers = getTokenParsers;

	public static readonly Child = CnCDice as typeof DiceBase;

	public static readonly GameType = CnCDice.GameType;

}