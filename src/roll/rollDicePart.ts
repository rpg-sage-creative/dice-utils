import { debug } from "@rsc-utils/console-utils";
import type { TDicePart } from "../dice/DicePart.js";
import { rollDataMapper } from "../internal/rollDataMapper.js";
import { rollDataSorter } from "../internal/rollDataSorter.js";
import { markRollData } from "../markup/markRollData.js";
import { sum } from "../sum.js";
import type { SortedRollData } from "../types/SortedDataRoll.js";
import { rollDice } from "./rollDice.js";

/** Creates the SortedRollData used to generate formatted dice output. */
export function rollDicePart(dicePart: TDicePart): SortedRollData {
	const { fixedRolls, count, sides } = dicePart;

	// start with fixed rolls
	const byIndex = fixedRolls.map((roll, index) => rollDataMapper(roll, index, sides, true));

	// roll up to count
	if (byIndex.length < count) {
		byIndex.push(...rollDice(count, sides).map(roll => rollDataMapper(roll, byIndex.length, sides, false)));
	}

	debug({fixedRolls,byIndex})

	const initialCount = byIndex.length;
	const initialSum = sum(byIndex.map(roll => roll.outputValue));

	let noSort = false;

	// manipulate the rolls
	dicePart.manipulation.forEach(m => {
		const rolls = byIndex.filter(roll => !roll.isDropped);
		m.dropKeep?.manipulateRolls(rolls);
		m.explode?.manipulateRolls(rolls);
		m.threshold?.manipulateRolls(rolls);
		if (m.noSort) noSort = true;
	});

	// mark the roll output
	byIndex.forEach(markRollData);

	const notDropped = byIndex.filter(roll => !roll.isDropped);

	return {
		byIndex,
		byValue: byIndex.slice().sort(rollDataSorter),
		count: notDropped.length,
		initialCount,
		initialSum,
		noSort,
		sum: sum(notDropped.map(roll => roll.outputValue))
	};
}