import { debug } from "@rsc-utils/core-utils";
import { assert, runTests } from "@rsc-utils/core-utils";
import { DiceGroup } from "../../build/index.js";

/** Roll fixed roll dice part with the given DiceDropKeep */
function rollAndReturn(rolls, dkString = "", xString = "", tString = "") {
	const dicePart = DiceGroup.parse(`(${rolls})${rolls.length}d6${dkString}${xString}${tString}`).roll().primary.primary;
	const dropKeep = dicePart.manipulation?.find(m => m.dropKeep)?.dropKeep;
	const explode = dicePart.manipulation?.find(m => m.explode)?.explode;
	const threshold = dicePart.manipulation?.find(m => m.threshold)?.threshold;
	return [ dicePart.sortedRollData, dicePart, dropKeep, explode, threshold ];
}

function rollCount(sortedData) { return sortedData.count; }
function rollSum(sortedData) { return sortedData.sum; }

runTests(async function test_DiceManipulation() {

	const [ data, dp, dk, x, t ] = rollAndReturn([1,2,3,4,5]);
	assert(5, rollCount, data);
	assert(15, rollSum, data);
	assert(undefined, () => dk);
	assert(undefined, () => x);
	assert(undefined, () => t);

	for (let i = 0; i < 10; i++) {
		const [ dataKH3X ] = rollAndReturn([1,2,3,4,6], "kh3", "x");
		assert(rollCount(dataKH3X) > 3, `dataKH3X failed: ${dataKH3X.byIndex.map(r => r.text)}`);
		assert(rollSum(dataKH3X) > 13, `dataKH3X failed: ${dataKH3X.byIndex.map(r => r.text)}`);
	}

	for (let i = 0; i < 10; i++) {
		const [ dataX4KH3HT5 ] = rollAndReturn([1,2,3,4,6], "kh3", "x>=4", "ht5");
		assert(rollCount(dataX4KH3HT5) >= 5, `dataX4KH3HT5 failed: ${dataX4KH3HT5.byIndex.map(r => r.text)}`);
		assert(rollSum(dataX4KH3HT5) >= 14, `dataX4KH3HT5 failed: ${dataX4KH3HT5.byIndex.map(r => r.text)}`);
	}

	for (let i = 0; i < 10; i++) {
		const [ dataHT5X5KH3 ] = rollAndReturn([1,2,3,4,6], "ht5", "x5", "kh3");
		assert(rollCount(dataHT5X5KH3) === 3, `dataHT5X5KH3 failed: ${dataHT5X5KH3.byIndex.map(r => r.text)}`);
		assert(rollSum(dataHT5X5KH3) >= 12, `dataHT5X5KH3 failed: ${dataHT5X5KH3.byIndex.map(r => r.text)}`);
		assert(rollSum(dataHT5X5KH3) <= 16, `dataHT5X5KH3 failed: ${dataHT5X5KH3.byIndex.map(r => r.text)}`);
	}

}, true);