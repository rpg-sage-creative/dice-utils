import { HasIdCore, type IdCore } from "@rsc-utils/class-utils";
import { randomSnowflake } from "@rsc-utils/snowflake-utils";
import { cleanWhitespace } from "@rsc-utils/string-utils";
import { DiceTest } from "../DiceTest.js";
import { sum } from "../sum.js";
import { DiceOutputType } from "../types/DiceOutputType.js";
// import type { SimpleDice } from "../types/SimpleDice.js";
import { DicePart, type DicePartCore, type TDicePart } from "./DicePart.js";
import type { DiceRoll, TDiceRoll } from "./DiceRoll.js";

export interface DiceCore<GameType extends number = number> extends IdCore<"Dice"> {
	diceParts: DicePartCore[];
	gameType: GameType;
}

export type TDice = Dice<DiceCore, TDicePart, TDiceRoll>;

export class Dice<T extends DiceCore, U extends TDicePart, V extends TDiceRoll> extends HasIdCore<T> {
	//#region from this.core
	private _diceParts?: U[];
	public get diceParts(): U[] {
		if (!this._diceParts) {
			const fromCore = (<typeof Dice>this.constructor).Part.fromCore;
			this._diceParts = <U[]>this.core.diceParts.map(fromCore);
		}
		return this._diceParts;
	}
	//#endregion

	//#region calculated
	public get baseDicePart(): U | undefined { return this.diceParts.find(dicePart => dicePart.hasDie); }
	public get max(): number { return sum(this.diceParts.map(dicePart => dicePart.max)); }
	public get min(): number { return sum(this.diceParts.map(dicePart => dicePart.min)); }
	public get test(): DiceTest { return this.diceParts.find(dicePart => dicePart.hasTest)?.test ?? DiceTest.EmptyTest; }
	//#endregion

	//#region flags
	public get hasFixed(): boolean { return !!this.baseDicePart?.fixedRolls?.length; }
	public get hasTest(): boolean { for (const dp of this.diceParts) if (dp.hasTest) return true; return false; }
	public get isD20(): boolean { return this.baseDicePart?.sides === 20; }
	public get isEmpty(): boolean { return this.diceParts.length === 0 || this.diceParts.filter(dicePart => !dicePart.isEmpty).length === 0; }
	//#endregion

	//#region methods
	public includes(dicePartOrCore: TDicePart | DicePartCore): boolean {
		const dicePartCore = "toJSON" in dicePartOrCore ? dicePartOrCore.toJSON() : dicePartOrCore;
		return this.diceParts.find(_dicePart => _dicePart.toJSON() === dicePartCore) !== undefined;
	}

	/** Returns null if this.isEmpty is true, otherwise it returns the results */
	public quickRoll(): number | null {
		if (this.isEmpty) {
			return null;
		}
		const _constructor = <typeof Dice>this.constructor;
		const roll = <V>_constructor.Roll.create(this, false);
		return roll.total;
	}
	//#endregion

	//#region IHasDieCore
	public get hasSecret(): boolean { return this.diceParts.find(dicePart => dicePart.hasSecret) !== undefined; }
	//#endregion

	//#region DiceBase
	public roll(): V {
		const _constructor = <typeof Dice>this.constructor;
		return <V>_constructor.Roll.create(this, true);
	}
	public toString(outputType?: DiceOutputType): string {
		const _outputType = outputType === DiceOutputType.S ? DiceOutputType.S : DiceOutputType.M;
		const output = this.diceParts.map((dicePart, index) => dicePart.toString(index, _outputType)).join(" ");
		return cleanWhitespace(output);
	}
	//#endregion

	//#region static
	public static create(diceParts: TDicePart[]): TDice {
		return new Dice({
			objectType: "Dice",
			gameType: 0,
			id: randomSnowflake(),
			diceParts: diceParts.map(dicePart => dicePart.toJSON())
		});
	}
	public static fromCore(core: DiceCore): TDice {
		return new Dice(core);
	}
	public static fromDicePartCores(dicePartCores: DicePartCore[]): TDice {
		return Dice.create(dicePartCores.map(DicePart.fromCore));
	}
	// public static parse(diceString: string): TDice {
	// 	const diceGroup = DiceGroup.parse(diceString);
	// 	return diceGroup?.dice[0] ?? null;
	// }
	/** Returns null if diceString can't be parsed, otherwise it returns the results */
	// public static roll(diceString: SimpleDice): number;
	// public static roll(diceString: string): number | null;
	// public static roll(diceString: string): number | null {
	// 	const _dice = Dice.parse(diceString);
	// 	return _dice?.quickRoll() ?? null;
	// }

	public static Part = DicePart;
	public static Roll: typeof DiceRoll;
	//#endregion
}