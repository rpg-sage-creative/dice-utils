import { assert, runTests } from "@rsc-utils/test-utils";
import { createSortedRollData } from "../build/index.js";
import { rollDataMapper, rollDataSorter } from "../build/internal/index.js";

// rio => RollIndexOutput = { roll, index, output }

/** Adjusts the count baed on the ddk values. */
function adjustCount(ddk, rolls) { return ddk.adjustCount(rolls.length); }

/** Adjusts the sum baed on the ddk values. */
function adjustSum(ddk, rolls) { return ddk.adjustSum(rolls.map(rio => rio.roll)); }

/** Clones the rolls so we can keep using the same starting data. */
function cloneRolls(rolls) { return rolls.map(rio => ({...rio})); }

/** Creates RollData for testing. */
function mapRoll(roll, index) { return rollDataMapper(roll, index, 6, false); }

/** Clones and sorts the rolls for testing. */
function sortRolls(rolls) { return cloneRolls(rolls).sort(rollDataSorter); }

runTests(async function testCreateSortedRollData() {
	const dice = { fixedRolls:[], sides:6 };
	const rolls = [4, 1, 6, 3, 1];
	const byIndex = rolls.map(mapRoll);
	const byRoll = [
		mapRoll(1, 1),
		mapRoll(1, 4),
		mapRoll(3, 3),
		mapRoll(4, 0),
		mapRoll(6, 2),
	];

	assert(byRoll, sortRolls, byIndex);

	assert({ byIndex, byRoll, length:rolls.length }, createSortedRollData, { dice, rolls });
}, true);