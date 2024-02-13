import type { RollData } from "../types/RollData.js";

/** @internal Creates the RollData used to markup die roll output. */
export function rollDataMapper(roll: number, index: number, dieSize: number, isFixed: boolean): RollData {
	return {
		dieSize,
		index,
		initialValue: roll,
		isFixed,
		isMax: roll === dieSize,
		isMin: roll === 1,
		output: String(roll),
		outputValue: roll,
		sumValue:roll
	};
}
