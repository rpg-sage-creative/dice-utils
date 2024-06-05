import { debug, info, warn } from "@rsc-utils/core-utils";
import { assert, runTests, startAsserting, stopAsserting } from "@rsc-utils/core-utils";
import { randomItems } from "../../build/index.js";

function uniqueFilter(object, index, array) {
	return array.indexOf(object) === index;
}

runTests(function test_randomItems() {
	// 1000 iterations wasn't enough to always hit all 1s or all 4s in 5d4!!!!
	const testIterations = 10000;

	const values = ["a", "b", "c", 1, 2, 3, { y:"z" }];
	const args = [[1], [2], [3, true], [10], [10, true]];
	args.forEach(([count, unique]) => {
		const call = `randomItems(values = ["a", "b", "c", 1, 2, 3, { y:"z" }], count = ${count}, unique = ${unique})`;
		const map = new Map();
		let i = testIterations;
		while (i--) {
			const randomSelections = randomItems(values, count, unique);
			assert(randomSelections.length === (unique ? Math.min(count, values.length) : count), `Incorrect results length of ${call}`);
			if (unique) {
				assert(randomSelections.length === randomSelections.filter(uniqueFilter).length, `Expected unique values from ${call}`);
			}
			randomSelections.forEach(randomValue => {
				if (!map.has(randomValue)) map.set(randomValue, 1);
				else map.set(randomValue, map.get(randomValue) + 1);
			});
		}
		for (const val of values) {
			assert(map.has(val), `Result ${JSON.stringify(val)} missing from ${testIterations} of ${call}`);
		}
		const keys = Array.from(map.keys());
		const unwantedKeys = keys.filter(key => values.indexOf(key) < 0);
		assert(unwantedKeys.length === 0, `Unexpected results from ${testIterations} of ${call}: ${unwantedKeys}`);
	});
}, true);
