import { randomSnowflake } from "@rsc-utils/snowflake-utils";
import { DiceTest, type DiceTestData } from "../DiceTest.js";
import { cleanDicePartDescription } from "../cleanDicePartDescription.js";
import { hasSecretFlag } from "../internal/hasSecretFlag.js";
import { DiceDropKeep } from "../manipulate/DiceDropKeep.js";
import { DiceExplode } from "../manipulate/DiceExplode.js";
import { type DiceManipulationData } from "../manipulate/DiceManipulationData.js";
import { DiceThreshold } from "../manipulate/DiceThreshold.js";
import { rollDicePart } from "../roll/rollDicePart.js";
import type { DiceOperator } from "../types/DiceOperator.js";
import { DiceOutputType } from "../types/DiceOutputType.js";
import type { RollData } from "../types/RollData.js";
import type { SortedRollData } from "../types/SortedDataRoll.js";
import { DiceBase, type DiceBaseCore } from "./DiceBase.js";

type DicePartCoreBase = {

	/** number of dice */
	count?: number;

	/** description of dice or modifier */
	description: string;

	/** values to use instead of rolling */
	fixedRolls?: number[];

	/** do we have: dropKeep, explode, threshold ? ? ? */
	manipulation?: DiceManipulationData[];

	/** roll modifier */
	modifier?: number;

	/** number of sides on the dice */
	sides?: number;

	/** sign (- or +) of the dice or modifier */
	sign?: DiceOperator;

	sortedRollData?: SortedRollData;

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


	public constructor(core: CoreType) {
		super(core);
		core.manipulation?.forEach(m => {
			if (m.dropKeep) m.dropKeep = new DiceDropKeep(m.dropKeep);
			if (m.explode) m.explode = new DiceExplode(m.explode);
			if (m.threshold) m.threshold = new DiceThreshold(m.threshold);
		});
	}

	//#region from this.core

	public get count(): number { return this.core.count ?? 0; }

	public get description(): string { return this.core.description ?? ""; }

	public get fixedRolls(): number[] { return this.core.fixedRolls ?? []; }

	public get manipulation(): DiceManipulationData[] { return this.core.manipulation ?? []; }

	public get modifier(): number { return this.core.modifier ?? 0; }

	public get sides(): number { return this.core.sides ?? 0; }

	public get sign(): DiceOperator | undefined { return this.core.sign; }

	public get sortedRollData(): SortedRollData | undefined { return this.core.sortedRollData; };

	private _test?: DiceTest;
	public get test(): DiceTest { return this._test ?? (this._test = new DiceTest(this.core.test)); }

	//#endregion

	//#region flags

	public get hasDescription(): boolean { return this.description.length > 0; }
	public get hasDie(): boolean { return this.count > 0 && this.sides > 0; }
	public get hasManipulation(): boolean { return this.manipulation.length > 0; }
	public get hasRolls(): boolean { return !!this.sortedRollData; }
	public get hasSecret(): boolean { return hasSecretFlag(this.description); }
	public get hasTest(): boolean { return !this.test.isEmpty; }
	public get isEmpty(): boolean { return this.count === 0 && this.sides === 0 && this.modifier === 0; }
	public get isMax(): boolean { return this.total === this.max; }
	public get isMin(): boolean { return this.total === this.min; }

	//#endregion

	//#region roll

	//#region helpers

	/** The biggest possible result. Simply totals max roll + modifier. */
	private get biggest(): number { return (this.hasRolls ? this.rollCount : this.count) * this.sides + this.modifier; }

	/** The smallest possible result. Simply totals min roll + modifier. */
	private get smallest(): number { return (this.hasRolls ? this.rollCount : this.count) + this.modifier; }

	//#endregion

	/** The maximum possible result. Accounts for negative numbers, thus -1d6 has max of -1 and min of -6. */
	public get max(): number { return this.sign === "-" ? -1 * this.smallest : this.biggest; }

	/** How many dice rolled max (value equal to .dice.sides). */
	public get maxCount(): number { return this.rollsByIndex.filter(roll => !roll.isDropped && roll.isMax).length; }

	/** The minimum possible result. Accounts for negative numbers, thus -1d6 has max of -1 and min of -6. */
	public get min(): number { return this.sign === "-" ? -1 * this.biggest : this.smallest; }

	/** How many dice rolled 1. */
	public get minCount(): number { return this.rollsByIndex.filter(roll => !roll.isDropped && roll.isMin).length; }

	public get rollCount(): number { return this.sortedRollData?.count ?? 0; }

	public get rollSum(): number { return this.sortedRollData?.sum ?? 0; }

	public get rollsByIndex(): RollData[] { return this.sortedRollData?.byIndex ?? []; }

	public get rollsByValue(): RollData[] { return this.sortedRollData?.byValue ?? []; }

	public get total(): number {
		const mod = this.modifier;
		const rollSum = this.rollSum;
		const mult = this.sign === "-" ? -1 : 1;
		return mult * (mod + rollSum);
	}

	public roll(): this {
		if (!this.isEmpty || !this.hasRolls) {
			this.core.sortedRollData = rollDicePart(this);
		}
		return this;
	}

	//#endregion

	public toDiceString(outputType?: DiceOutputType, index?: number): string {
		const die = this.count && this.sides ? `${this.count}d${this.sides}` : ``,
			manipulation = this.toManipulationString(),
			mod = this.modifier ? ` ${this.modifier}` : ``,
			valueTest = this.test.toString(),
			withoutDescription = die + manipulation + mod + valueTest;
		if (outputType === DiceOutputType.S) {
			return withoutDescription;
		}
		const sign = index && !this.isEmpty ? `${this.sign ?? "+"}` : ``;
		return `${sign} ${withoutDescription} ${this.description}`.trim();
	}

	protected toManipulationString(leftPad?: string, rightPad?: string): string {
		return this.manipulation?.map(m => {
			return m.dropKeep?.toString(leftPad, rightPad)
				?? m.explode?.toString(leftPad, rightPad)
				?? m.threshold?.toString(leftPad, rightPad);
		})
		.filter(s => s?.length)
		.join(" ") ?? "";
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
			sides: args.sides ?? 0,
			sign: args.sign,
			sortedRollData: args.sortedRollData,
			test: args.test,

			children: undefined!
		});
	}

	public static fromCore<CoreType, DiceType>(core: CoreType): DiceType {
		return new DicePart(core as DicePartCore) as DiceType;
	}

	//#endregion
}