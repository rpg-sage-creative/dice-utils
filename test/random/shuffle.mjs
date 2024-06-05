import { debug, info, warn } from "@rsc-utils/core-utils";
import { assert, runTests, startAsserting, stopAsserting } from "@rsc-utils/core-utils";
import { shuffle } from "../../build/index.js";

runTests(function test_shuffle() {
	// 1000 iterations wasn't enough to always hit all 1s or all 4s in 5d4!!!!
	const testIterations = 10000;

	const call = `shuffle(values = ["a", 2, { three:"FOUR" }, "five", 6, "7"])`;
	const values = ["a", 2, { three:"FOUR" }, "five", 6, "7"];
	const sortedValuesJson = JSON.stringify(values.slice().sort());
	let iteration = testIterations;
	while (iteration--) {
		const shuffled = shuffle(values);
		const shuffledJson = JSON.stringify(shuffled);
		const sortedShuffledJson = JSON.stringify(shuffled.slice().sort());
		assert(sortedValuesJson === sortedShuffledJson, `Shuffled array has invalid values: ${sortedValuesJson} !== ${sortedShuffledJson}`);
		assert(shuffled.filter((val, i) => values[i] === val).length < shuffled.length, `No values changed locations! ${shuffledJson}`);
		const unwantedValues = shuffled.filter(val => values.indexOf(val) < 0);
		assert(unwantedValues.length === 0, `Unexpected results from ${testIterations} of ${call}: ${unwantedValues}`);
	}
}, true);
