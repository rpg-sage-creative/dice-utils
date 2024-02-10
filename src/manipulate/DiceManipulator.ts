/*
The concept here is to allow complex combinations.
	ex: [ 10d6 dl3 x6 kh5 lt2 ]
	1. roll 10d6
	2. drop lowest 3
	3. explode any values of 6
	4. keep highest 5
	5. lowest threshold 2
*/

import type { TokenData } from "@rsc-utils/string-utils";
import { sum } from "../sum.js";
import { DiceDropKeep, type DiceDropKeepData } from "./DiceDropKeep.js";
import { DiceExplode, type DiceExplodeData } from "./DiceExplode.js";
import { DiceThreshold, type DiceThresholdData } from "./DiceThreshold.js";

export type DiceManipulationData = {
	dropKeep?: DiceDropKeepData;
	explode?: DiceExplodeData;
	noSort?: boolean;
	threshold?: DiceThresholdData;
};

export type HasDiceManipulationData = {
	manipulation?: DiceManipulationData[];
};

export function appendManipulationToCore(core: HasDiceManipulationData, token: TokenData, index: number, tokens: TokenData[]): boolean {
	const lastToken = tokens[index - 1];
	if (["dice", "dropKeep", "explode", "noSort", "threshold"].includes(lastToken?.key)) {
		const dropKeep = DiceDropKeep.from(token);
		const explode = DiceExplode.from(token);
		const noSort = token.key === "noSort"; // if we want to be strict about not duping "ns": && !core.manipulation?.find(m => m.noSort);
		const threshold = DiceThreshold.from(token);
		if (!dropKeep.isEmpty || !explode.isEmpty || noSort || !threshold.isEmpty) {
			const manipulation = core.manipulation ?? (core.manipulation = []);
			manipulation.push({
				dropKeep: dropKeep.toJSON(),
				explode: explode.toJSON(),
				noSort: noSort ? true : undefined,
				threshold: threshold.toJSON()
			});
			return true;
		}
	}
	return false;
}

export class DiceManipulator {

	public constructor(protected data?: DiceManipulationData[]) { }

	public get adjustedCount(): number {
		if (this.hasRolls) {
			if (this.isEmpty) {
				return this.rolls.length;
			}
			/** @todo perform all dice manipulation, in order, and then expose the final dice count as adjustedCount */
			return this.dropKeep?.adjustCount(this.rolls.length) ?? this.rolls.length;
		}
		return 0;
	}

	public get adjustedRolls(): number[] {
		if (this.hasRolls) {
			if (this.isEmpty) {
				return this.rolls.slice();
			}
			return this.rolls.slice();
		}
		return [];
	}

	public get adjustedSum(): number {
		if (this.hasRolls) {
			if (this.isEmpty) {
				return sum(this.rolls);
			}
			/** @todo perform all dice manipulation, in order, and then expose the final dice count as adjustedCount */
			return this.dropKeep?.adjustSum(this.rolls) ?? sum(this.rolls);
		}
		return 0;
	}

	public get dropKeep(): DiceDropKeep { return new DiceDropKeep(this.data?.find(m => m.dropKeep)?.dropKeep); }

	public get hasDropKeep(): boolean { return !this.dropKeep.isEmpty; }

	public get hasRolls(): boolean { return !!this._rolls?.length; }

	public get isEmpty(): boolean { return !!this.data?.length; }

	private _rolls?: number[];
	public get rolls(): number[] { return this._rolls?.slice() ?? []; }

	public manipulate(rolls: number[]) {
		if (this.hasRolls) {
			return;
		}

		this._rolls = rolls;
	}

	public get noSort(): boolean { return this.data?.find(m => m.noSort)?.noSort === true; }

	public toJSON() { return this.data; }

	public toString(): string {
		return this.data?.map(m => {
			if (m.dropKeep) {
				return new DiceDropKeep(m.dropKeep).toString();
			}else if (m.explode) {
				return new DiceExplode(m.explode).toString();
			}else if (m.threshold) {
				return new DiceThreshold(m.threshold).toString();
			}
			return "";
		})
		.filter(s => s?.length)
		.join(" ") ?? "";
	}
}
