import { randomSnowflake } from "@rsc-utils/snowflake-utils";
import { isGradeFailure } from "../grade.js";
import { isBoolean } from "../internal/isBoolean.js";
import { isDiceOutputType } from "../internal/isDiceOutputType.js";
import { DiceCriticalMethodType } from "../types/DiceCriticalMethodType.js";
import { DiceOutputType } from "../types/DiceOutputType.js";
import { DiceSecretMethodType } from "../types/DiceSecretMethodType.js";
import { Dice, type DiceCore, type TDice } from "./Dice.js";
import { DiceBase, type DiceBaseCore } from "./DiceBase.js";

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

	public static create(dice: TDice[], args: DiceGroupCoreArgs = {}): TDiceGroup {
		return new DiceGroup({
			objectType: "DiceGroup",
			gameType: 0,
			id: randomSnowflake(),

			children: dice.map(dice => dice.toJSON()),
			criticalMethodType: args.criticalMethodType,
			outputType: args.outputType,
			secretMethodType: args.secretMethodType
		});
	}

	public static fromCore<CoreType, DiceType>(core: CoreType): DiceType {
		return new DiceGroup(core as DiceGroupCore) as DiceType;
	}

	public static Child = Dice as typeof DiceBase;

	//#endregion
}