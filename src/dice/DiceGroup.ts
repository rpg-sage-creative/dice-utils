import { randomSnowflake } from "@rsc-utils/snowflake-utils";
import { isGradeFailure } from "../grade.js";
import { isBoolean } from "../internal/isBoolean.js";
import { isDiceOutputType } from "../internal/isDiceOutputType.js";
import { DiceCriticalMethodType } from "../types/DiceCriticalMethodType.js";
import { DiceOutputType } from "../types/DiceOutputType.js";
import { DiceSecretMethodType } from "../types/DiceSecretMethodType.js";
import { Dice, type DiceCore, type TDice } from "./Dice.js";
import { DiceBase, type DiceBaseCore } from "./DiceBase.js";
import { tokenize } from "@rsc-utils/string-utils";
import { getDiceTokenParsers } from "../token/getDiceTokenParsers.js";
import { tokensToDiceGroup } from "../token/tokensToDiceGroup.js";

type DiceGroupCoreBase = {
	criticalMethodType?: DiceCriticalMethodType;
	outputType?: DiceOutputType;
	secretMethodType?: DiceSecretMethodType;
};

export type DiceGroupCoreArgs = Partial<DiceGroupCoreBase>;

export type DiceGroupCore<GameType extends number = number>
	= DiceGroupCoreBase
	& DiceBaseCore<DiceCore, "DiceGroup", GameType>;

export type TDiceGroup = DiceGroup<DiceGroupCore, TDice>;

export class DiceGroup<
			CoreType extends DiceGroupCore<GameType>,
			ChildType extends TDice,
			GameType extends number = number
			> extends DiceBase<CoreType, ChildType, "DiceGroup", GameType> {


	public get criticalMethodType(): DiceCriticalMethodType | undefined { return this.core.criticalMethodType; }

	public get outputType(): DiceOutputType | undefined { return this.core.outputType; }

	public get primary(): ChildType | undefined { return this.children.find(child => child.primary); }

	public get secretMethodType(): DiceSecretMethodType | undefined { return this.core.secretMethodType; }

	public toDiceString(outputType?: DiceOutputType): string {
		return `[${this.children.map(dice => dice.toDiceString(outputType)).join("; ")}]`;
	}

	public toRollString(...args: (boolean | DiceOutputType)[]): string {
		const hideRolls = args.find(isBoolean) ?? false;
		const outputType = this.outputType ?? args.find(isDiceOutputType) ?? DiceOutputType.M;
		const joiner = outputType < DiceOutputType.L ? "; " : "\n";
		const output: string[] = [];
		for (const dice of this.children) {
			output.push(dice.toRollString(outputType, hideRolls));
			const grade = dice.grade;
			if (isGradeFailure(grade)) {
				// if there are multiple tests, we should start at the first failure ... right?
				break;
			}
		}
		return output.join(joiner);
	}

	//#region static

	public static create<DiceGroupType extends TDiceGroup, DiceType extends TDice>(dice: DiceType[], args: DiceGroupCoreArgs = {}): DiceGroupType {
		return new this({
			objectType: "DiceGroup",
			gameType: 0,
			id: randomSnowflake(),

			children: dice.map(dice => dice.toJSON()),
			criticalMethodType: args.criticalMethodType,
			outputType: args.outputType,
			secretMethodType: args.secretMethodType
		}) as DiceGroupType;
	}

	public static fromCore<CoreType extends DiceGroupCore, DiceGroupType extends TDiceGroup>(core: CoreType): DiceGroupType {
		return new this(core as DiceGroupCore) as DiceGroupType;
	}

	public static parse<DiceType extends TDiceGroup>(diceString: string, outputType?: DiceOutputType): DiceType {
		const tokens = tokenize(diceString, getDiceTokenParsers(), "desc");
		return tokensToDiceGroup(tokens, this, { outputType });
	}

	public static readonly Child = Dice as typeof DiceBase;

	//#endregion
}