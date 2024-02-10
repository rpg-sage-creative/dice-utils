import { randomSnowflake } from "@rsc-utils/snowflake-utils";
import { DiceTest, type DiceTestData } from "../DiceTest.js";
import { cleanDicePartDescription } from "../cleanDicePartDescription.js";
import { hasSecretFlag } from "../internal/hasSecretFlag.js";
import { DiceManipulator, type DiceManipulationData } from "../manipulate/DiceManipulator.js";
import { rollDice } from "../roll/rollDice.js";
import type { DiceOperator } from "../types/DiceOperator.js";
import { DiceOutputType } from "../types/DiceOutputType.js";
import { DiceBase, type DiceBaseCore } from "./DiceBase.js";

type DicePartCoreBase = {

	/** number of dice */
	count: number;

	/** description of dice or modifier */
	description: string;

	/** values to use instead of rolling */
	fixedRolls?: number[];

	/** the initially rolled values (before manipulation) */
	initialRolls?: number[];

	/** the final rolled values (after manipulation) */
	manipulatedRolls?: number[];

	/** do we have: dropKeep, explode, threshold ? ? ? */
	manipulation?: DiceManipulationData[];

	/** roll modifier */
	modifier: number;

	/** number of sides on the dice */
	sides: number;

	/** sign (- or +) of the dice or modifier */
	sign?: DiceOperator;

	/** target test information */
	test?: DiceTestData;

};

export type DicePartCoreArgs = Partial<DicePartCoreBase>;

export type DicePartCore<GameType extends number = number>
	= DicePartCoreBase
	& DiceBaseCore<never, "DicePart", GameType>;

export type TDicePart = DicePart<DicePartCore>;

export class DicePart<
			CoreType extends DicePartCore<GameType>,
			GameType extends number = number
			>extends DiceBase<CoreType, never, "DicePart", GameType> {

	//#region from this.core

	public get count(): number { return this.core.count; }

	public get description(): string { return this.core.description; }

	public get fixedRolls(): number[] { return this.core.fixedRolls ?? []; }

	public get initialRolls(): number[] { return this.core.initialRolls ?? []; }

	public get manipulatedRolls(): number[] { return this.core.manipulatedRolls ?? []; }

	private _manipulation?: DiceManipulator;
	public get manipulation(): DiceManipulator { return this._manipulation ?? (this._manipulation = new DiceManipulator(this.core.manipulation)); }

	public get modifier(): number { return this.core.modifier; }

	public get sides(): number { return this.core.sides; }

	public get sign(): DiceOperator | undefined { return this.core.sign; }

	private _test?: DiceTest;
	public get test(): DiceTest { return this._test ?? (this._test = new DiceTest(this.core.test)); }

	//#endregion

	//#region calculated

	public get adjustedCount(): number { return this.manipulation.adjustedCount; }

	/** The biggest possible result. Simply totals max roll + modifier. */
	private get biggest(): number { return this.adjustedCount * this.sides + this.modifier; }

	/** The maximum possible result. Accounts for negative numbers, thus -1d6 has max of -1 and min of -6. */
	public get max(): number { return this.sign === "-" ? -1 * this.smallest : this.biggest; }

	/** How many dice rolled max (value equal to .dice.sides). */
	public get maxCount(): number { return this.manipulatedRolls.filter(roll => roll === this.sides).length; }

	/** The minimum possible result. Accounts for negative numbers, thus -1d6 has max of -1 and min of -6. */
	public get min(): number { return this.sign === "-" ? -1 * this.biggest : this.smallest; }

	/** How many dice rolled 1. */
	public get minCount(): number { return this.manipulatedRolls.filter(roll => roll === 1).length; }

	/** The smallest possible result. Simply totals min roll + modifier. */
	private get smallest(): number { return this.adjustedCount + this.modifier; }

	public get total(): number {
		if (this.hasRolls) {
			const mod = this.modifier;
			const adjustedSum = this.manipulation.adjustedSum;
			const mult = this.sign === "-" ? -1 : 1;
			return mult * (mod + adjustedSum);
		}
		return 0;
	}

	//#endregion

	//#region flags

	public get hasDescription(): boolean { return this.core.description.length > 0; }
	public get hasDie(): boolean { return this.count > 0 && this.sides > 0; }
	public get hasManipulation(): boolean { return !this.manipulation.isEmpty; }
	public get hasRolls(): boolean { return this.initialRolls.length > 0; }
	public get hasSecret(): boolean { return hasSecretFlag(this.description); }
	public get hasTest(): boolean { return !this.test.isEmpty; }
	public get isEmpty(): boolean { return this.count === 0 && this.sides === 0 && this.modifier === 0; }
	public get isMax(): boolean { return this.total === this.max; }
	public get isMin(): boolean { return this.total === this.min; }

	//#endregion

	public roll(): void {
		if (this.isEmpty) {
			return;
		}

		const rolls = this.fixedRolls.slice(0, this.count);
		if (rolls.length < this.count) {
			rolls.push(...rollDice(this.count - rolls.length, this.sides));
		}
		this.manipulation.manipulate(rolls);

		this.core.initialRolls = rolls;
		this.core.manipulatedRolls;
	}

	public toDiceString(outputType?: DiceOutputType, index?: number): string {
		const die = this.count && this.sides ? `${this.count}d${this.sides}` : ``,
			manipulation = this.manipulation.toString(),
			mod = this.modifier ? ` ${this.modifier}` : ``,
			valueTest = this.test.toString(),
			withoutDescription = die + manipulation + mod + valueTest;
		if (outputType === DiceOutputType.S) {
			return withoutDescription;
		}
		const sign = index && !this.isEmpty ? `${this.sign ?? "+"}` : ``;
		return `${sign} ${withoutDescription} ${this.description}`.trim();
	}

	public toRollString(): string { return ""; }

	//#region static

	public static create(args: DicePartCoreArgs = {}): TDicePart {
		return new DicePart({
			objectType: "DicePart",
			gameType: 0,
			id: randomSnowflake(),

			count: args.count ?? 0,
			description: cleanDicePartDescription(args.description),
			manipulation: args.manipulation,
			modifier: args.modifier ?? 0,
			fixedRolls: args.fixedRolls,
			initialRolls: args.initialRolls,
			// manipulatedRolls: args.manipulatedRolls,
			sides: args.sides ?? 0,
			sign: args.sign,
			test: args.test,

			children: undefined!
		});
	}

	public static fromCore<CoreType, DiceType>(core: CoreType): DiceType {
		return new DicePart(core as DicePartCore) as DiceType;
	}

	//#endregion
}
