import type { TDicePart } from "./dice/DicePart.js";
import { rollDataMapper } from "./internal/rollDataMapper.js";
import { rollDataSorter } from "./internal/rollDataSorter.js";
import type { RollData } from "./types/RollData.js";

/** Contains the Roll Data length and sorted arrays. */
type SortedRollData = {
	/** Sorted by index */
	byIndex: RollData[];
	/** Sorted by roll (value/result) */
	byRoll: RollData[];
	/** Number of RollData objects */
	length: number;
};

/** Creates the SortedRollData used to generate formatted dice output. */
export function createSortedRollData(dicePart: TDicePart, markDropped?: boolean): SortedRollData {
	const { fixedRolls, initialRolls, sides } = dicePart;
	const fixedRollsLength = fixedRolls?.length ?? 0;
	const byIndex = initialRolls.map((roll, index) => rollDataMapper(roll, index, sides, index < fixedRollsLength));
	const byRoll = byIndex.slice().sort(rollDataSorter);
	if (markDropped) {
		dicePart.manipulation.dropKeep.markDropped(byIndex);
	}
	return { byIndex:byIndex, byRoll:byRoll, length:initialRolls.length };
}