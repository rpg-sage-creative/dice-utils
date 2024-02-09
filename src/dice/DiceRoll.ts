import { HasIdCore, type IdCore } from "@rsc-utils/class-utils";
import { randomSnowflake } from "@rsc-utils/snowflake-utils";
import { cleanWhitespace, dequote } from "@rsc-utils/string-utils";
import { detick } from "../internal/detick.js";
import { DieRollGrade, gradeRoll, gradeToEmoji } from "../grade.js";
import { mapDicePartRollToString } from "../mapDicePartRollToString.js";
import { removeDesc } from "../removeDesc.js";
import { sumDicePartRolls } from "../sumDicePartRolls.js";
import { DiceOutputType } from "../types/DiceOutputType.js";
import { UNICODE_LEFT_ARROW } from "../types/consts.js";
import { Dice, type DiceCore, type TDice } from "./Dice.js";
import type { DicePartRollCore, TDicePartRoll } from "./DicePartRoll.js";

export interface DiceRollCore<GameType extends number = number> extends IdCore<"DiceRoll"> {
	dice: DiceCore;
	gameType: GameType;
	rolls: DicePartRollCore[];
}

export type TDiceRoll = DiceRoll<DiceRollCore, TDice, TDicePartRoll>;

export class DiceRoll<T extends DiceRollCore, U extends TDice, V extends TDicePartRoll> extends HasIdCore<T> {
	//#region calculated
	public get grade(): DieRollGrade { return gradeRoll(this); }
	public get total(): number { return sumDicePartRolls(this.rolls); }
	//#endregion

	//#region flags
	public get isMax(): boolean { return this.total === this.dice.max; }
	public get isMin(): boolean { return this.total === this.dice.min; }
	//#endregion

	//#region RollBase
	private _dice?: U;
	public get dice(): U {
		if (!this._dice) {
			const fromCore = (<typeof DiceRoll>this.constructor).Dice.fromCore;
			this._dice = <U>fromCore(this.core.dice);
		}
		return this._dice;
	}
	public get hasSecret(): boolean {
		return this.dice.hasSecret;
	}
	private _rolls?: V[];
	public get rolls(): V[] {
		if (!this._rolls) {
			const fromCore = (<typeof DiceRoll>this.constructor).Dice.Part.Roll.fromCore;
			this._rolls = <V[]>this.core.rolls.map(fromCore);
		}
		return this._rolls;
	}
	//#region toString
	protected _toString(outputType: DiceOutputType, hideRolls: boolean): string {
		const xxs = this.toStringXXS(hideRolls);
		const desc = this.dice.diceParts.find(dp => dp.hasDescription)?.description;

		const isRollem = outputType === DiceOutputType.ROLLEM;
		const noDice = [DiceOutputType.L, DiceOutputType.S, DiceOutputType.XS, DiceOutputType.XXS].includes(outputType);
		const description = this.rolls.map((roll, index) => mapDicePartRollToString(roll, index, { hideRolls, isRollem, noDice })).join(" ");

		if (isRollem) {
			const stripped = xxs.replace(/<\/?(b|em|i|strong)>/ig, "").trim();
			const [_, emoji, total] = stripped.match(/^(?:(.*?)\s+)(\d+)$/) ?? ["","",stripped];
			const escapedTotal = `\` ${total} \``;

			const output = desc
				? `${emoji} '${detick(dequote(desc))}', ${escapedTotal} ${UNICODE_LEFT_ARROW} ${removeDesc(description, desc)}`
				: `${emoji} ${escapedTotal} ${UNICODE_LEFT_ARROW} ${description}`;
			// return correctEscapeForEmoji(cleanWhitespace(output));
			return cleanWhitespace(output);
		}else {
			const output = desc
				? `${xxs} \`${detick(dequote(desc))}\` ${UNICODE_LEFT_ARROW} ${removeDesc(description, desc)}`
				: `${xxs} ${UNICODE_LEFT_ARROW} ${description}`;
			// return correctEscapeForEmoji(cleanWhitespace(output));
			return cleanWhitespace(output);
		}
	}
	protected toStringXS(hideRolls: boolean): string {
		const xxs = this.toStringXXS(hideRolls);
		const desc = this.dice.diceParts.find(dp => dp.hasDescription)?.description;
		const output = desc
			? `${xxs} \`${detick(dequote(desc)) ?? ""}\``
			: xxs;
		// return correctEscapeForEmoji(cleanWhitespace(output));
		return cleanWhitespace(output);
	}
	protected toStringXXS(hideRolls: boolean): string {
		const gradeEmoji = gradeToEmoji(this.grade),
			outputEmoji = hideRolls ? ":question:" : gradeEmoji ?? "",
			fixedOutput = this.dice.hasFixed ? "f" : "",
			totalString = `<i><b>${this.total}${fixedOutput}</b></i>`,
			totalOutput = hideRolls ? `||${totalString}||` : totalString,
			output = `${outputEmoji} ${totalOutput}`;
		return cleanWhitespace(output);
	}
	public toString(): string;
	public toString(hideRolls: boolean): string;
	public toString(outputType: DiceOutputType): string;
	public toString(outputType: DiceOutputType, hideRolls: boolean): string;
	public toString(hideRolls: boolean, outputType: DiceOutputType): string;
	public toString(...args: (boolean | DiceOutputType)[]): string {
		const hideRolls = <boolean>args.find(arg => arg === true || arg === false) ?? false;
		const outputType = <DiceOutputType>args.find(arg => !!(DiceOutputType[<DiceOutputType>arg] ?? false)) ?? DiceOutputType.M;
		if (outputType === DiceOutputType.XXS) {
			return this.toStringXXS(hideRolls);
		}
		if (outputType === DiceOutputType.XS) {
			return this.toStringXS(hideRolls);
		}
		return this._toString(outputType, hideRolls);
	}
	//#endregion
	//#endregion

	//#region static
	public static create(_dice: TDice, uuid: boolean): TDiceRoll {
		const core: DiceRollCore = {
			objectType: "DiceRoll",
			gameType: 0,
			//Quick rolls can never be reloaded, so we don't need a UUID
			id: uuid ? randomSnowflake() : null!,
			dice: _dice.toJSON(),
			rolls: _dice.diceParts.map(dicePart => dicePart.roll().toJSON())
		};
		return new DiceRoll(core);
	}
	public static fromCore(core: DiceRollCore): TDiceRoll {
		return new DiceRoll(core);
	}
	public static Dice = Dice;
	//#endregion
}

Dice.Roll = DiceRoll;