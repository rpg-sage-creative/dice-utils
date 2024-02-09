import { randomSnowflake } from "@rsc-utils/snowflake-utils";
import { DiceRollManipulator } from "../manipulate/DiceManipulator.js";
import { rollDice } from "../roll/rollDice.js";
import type { DiceOperator } from "../types/DiceOperator.js";
import { DicePart, type DicePartCore, type TDicePart } from "./DicePart.js";

export type DicePartRollCore<
			GameType extends number = number,
			ObjectType extends string = "DicePartRoll",
			IdType extends string = string> = {
	dice: DicePartCore;
	gameType: GameType;
	id: IdType;
	objectType: ObjectType;
	rolls: number[];
};

export type TDicePartRoll = DicePartRoll<DicePartRollCore, TDicePart>;

export class DicePartRoll<
			Core extends DicePartRollCore<GameType, ObjectType, IdType>,
			Dice extends TDicePart = TDicePart,
			GameType extends number = number,
			ObjectType extends string = "DicePartRoll",
			IdType extends string = string
			> {

	//#region HasCore
	public get objectType(): ObjectType { return this.core.objectType; }
	// public is(value: unknown): boolean { return value === this || value === this.core || (value as DicePart<any, any>)?.core === this.core; }
	public toJSON(): Core { return this.core; }
	//#endregion

	//#region HasIdCore
	public get id(): IdType { return this.core.id; }
	// protected get idMatcher() { return getIdMatcher(this.id); }
	// public equals(other: unknown): boolean { return !other ? false : other instanceof DicePart ? this.is(other) : this.idMatcher.matches(other); }
	//#endregion

	public constructor(protected core: Core) { }

	public get gameType(): GameType { return this.core.gameType; }

	//#region from this.dice
	public get sign(): DiceOperator | undefined {
		return this.dice.sign;
	}
	//#endregion

	private _manipulation?: DiceRollManipulator;
	public get manipulation() { return this._manipulation ?? (this._manipulation = new DiceRollManipulator(this.dice.manipulation, this.rolls)); }
	public get hasManipulation(): boolean { return !this.manipulation.isEmpty; }

	//#region calculated
	public get total(): number {
		const mod = this.dice.modifier;
		const adjustedSum = this.manipulation.adjustedSum;
		const mult = this.sign === "-" ? -1 : 1;
		return mult * (mod + adjustedSum);
	}
	//#endregion

	//#region flags
	public get isMax(): boolean { return this.total === this.dice.max; }
	public get isMin(): boolean { return this.total === this.dice.min; }
	//#endregion

	//#region RollBase
	private _dice?: Dice;
	public get dice(): Dice {
		if (!this._dice) {
			const fromCore = (<typeof DicePartRoll>this.constructor).Dice.fromCore;
			this._dice = fromCore(this.core.dice) as Dice;
		}
		return this._dice;
	}
	public get hasSecret(): boolean {
		return this.dice.hasSecret;
	}

	/** The raw rolls. */
	public get rolls(): number[] {
		return this.core.rolls.slice();
	}

	/** How many dice rolled 1. */
	public get minCount(): number {
		return this.core.rolls.filter(roll => roll === 1).length;
	}
	/** How many dice rolled max (value equal to .dice.sides). */
	public get maxCount(): number {
		return this.core.rolls.filter(roll => roll === this.dice.sides).length;
	}
	//#endregion

	//#region static

	protected static _createCore<Core extends DicePartRollCore>(dicePart: TDicePart): Core;
	protected static _createCore<Core extends DicePartRollCore, GameType extends number>(dicePart: TDicePart, gameType: GameType): Core;
	protected static _createCore(dicePart: TDicePart, gameType = 0) {
		const rolls = dicePart.fixedRolls.slice(0, dicePart.count);
		if (rolls.length < dicePart.count) {
			rolls.push(...rollDice(dicePart.count - rolls.length, dicePart.sides));
		}
		return {
			objectType: "DicePartRoll",
			gameType,
			id: randomSnowflake(),
			dice: dicePart.toJSON(),
			rolls
		};
	}

	public static create(dicePart: TDicePart): TDicePartRoll {
		return new DicePartRoll(this._createCore(dicePart));
	}
	public static fromCore(core: DicePartRollCore): TDicePartRoll {
		return new DicePartRoll(core);
	}
	public static Dice = DicePart;
	//#endregion
}

DicePart.Roll = DicePartRoll;