import { HasIdCore, type IdCore } from "@rsc-utils/class-utils";
import { randomSnowflake, type Snowflake } from "@rsc-utils/snowflake-utils";
import { DiceTest, type DiceTestData } from "../DiceTest.js";
import { cleanDicePartDescription } from "../cleanDicePartDescription.js";
import { hasSecretFlag } from "../internal/hasSecretFlag.js";
import { DiceManipulator, type DiceManipulationData } from "../manipulate/DiceManipulator.js";
import { reduceTokenToDicePartCore } from "../reduceTokenToDicePartCore.js";
import type { DiceOperator } from "../types/DiceOperator.js";
import { DiceOutputType } from "../types/DiceOutputType.js";
import { type TokenData } from "../types/TokenData.js";
import type { DicePartRoll, TDicePartRoll } from "./DicePartRoll.js";

interface DicePartCoreBase {

	/** number of dice */
	count: number;

	/** description of dice or modifier */
	description: string;

	/** do we have: dropKeep, explode, threshold ? ? ? */
	manipulation?: DiceManipulationData[];

	/** values to use instead of rolling */
	fixedRolls?: number[];

	/** roll modifier */
	modifier: number;

	/** number of sides on the dice */
	sides: number;

	/** sign (- or +) of the dice or modifier */
	sign?: DiceOperator;

	/** target test information */
	test?: DiceTestData;

}

export type DicePartCoreArgs = Partial<DicePartCoreBase>;

export interface DicePartCore<GameType extends number = number>
			extends DicePartCoreBase, IdCore<"DicePart", Snowflake> {
	gameType: GameType;
}

export type TDicePart = DicePart<DicePartCore, TDicePartRoll>;

export class DicePart<
			Core extends DicePartCore<GameType>,
			Roll extends TDicePartRoll = TDicePartRoll,
			GameType extends number = number
			>extends HasIdCore<Core> {

	// public constructor(core: Core) { super(core); }

	public get gameType(): GameType { return this.core.gameType; }

	//#region from this.core

	public get count(): number { return this.core.count; }

	public get description(): string { return this.core.description; }
	public get hasDescription(): boolean { return this.core.description.length > 0; }

	public get fixedRolls(): number[] { return this.core.fixedRolls ?? []; }

	private _manipulation?: DiceManipulator;
	public get manipulation(): DiceManipulator { return this._manipulation ?? (this._manipulation = new DiceManipulator(this.core.manipulation)); }
	public get hasManipulation(): boolean { return !this.manipulation.isEmpty; }

	public get modifier(): number { return this.core.modifier; }

	public get noSort(): boolean { return this.manipulation.noSort; }

	public get sides(): number { return this.core.sides; }

	public get sign(): DiceOperator | undefined { return this.core.sign; }

	private _test?: DiceTest;
	public get test(): DiceTest { return this._test ?? (this._test = new DiceTest(this.core.test)); }
	public get hasTest(): boolean { return !this.test.isEmpty; }

	//#endregion

	//#region calculated

	public get adjustedCount(): number { return this.manipulation.adjustedCount; }

	private get biggest(): number { return this.adjustedCount * this.sides + this.modifier; }
	private get smallest(): number { return this.adjustedCount + this.modifier; }

	public get max(): number { return this.sign === "-" ? -1 * this.smallest : this.biggest; }
	public get min(): number { return this.sign === "-" ? -1 * this.biggest : this.smallest; }

	//#endregion

	//#region flags

	public get hasDie(): boolean { return this.count > 0 && this.sides > 0; }
	public get isEmpty(): boolean { return this.count === 0 && this.sides === 0 && this.modifier === 0; }

	//#endregion

	//#region methods

	/** Returns null if this.isEmpty is true, otherwise it returns the results */
	public quickRoll(): number | null {
		if (this.isEmpty) {
			return null;
		}
		const _constructor = <typeof DicePart>this.constructor;
		const roll = _constructor.Roll.create(this as TDicePart);
		return roll.total;
	}

	//#endregion

	//#region DiceBase
	public get hasSecret(): boolean {
		return hasSecretFlag(this.description);
	}
	public roll(): Roll {
		const _constructor = <typeof DicePart>this.constructor;
		return _constructor.Roll.create(this as TDicePart) as Roll;
	}
	public toString(index?: number, outputType?: DiceOutputType): string {
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
	//#endregion

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
			test: args.test
		});
	}
	public static fromCore(core: DicePartCore): TDicePart {
		return new DicePart(core);
	}
	public static fromTokens(tokens: TokenData[]): TDicePart {
		const core = tokens.reduce(reduceTokenToDicePartCore, <DicePartCore>{ description:"" });
		return DicePart.create(core);
	}
	// public static toCore(dicePartOrCore: TDicePart | DicePartCore): DicePartCore {
	// 	return DicePart.toJSON(dicePartOrCore);
	// }
	public static Roll: typeof DicePartRoll;
	//#endregion
}
