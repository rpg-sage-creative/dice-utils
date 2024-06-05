import { debug, info, warn } from "@rsc-utils/core-utils";
import { assert, runTests, startAsserting, stopAsserting } from "@rsc-utils/core-utils";
import { randomInt } from "../../build/index.js";

runTests(function test_randomInt() {
	// 1000 iterations wasn't enough to always hit all 1s or all 4s in 5d4!!!!
	const testIterations = 10000;

	const values = [[-2, 2], [0, 23], [1, 5], [1, 25], [1, 100], [2, 5], [12, 25], [23, 100]];
	values.forEach(([min, max]) => {
		const map = new Map();
		let i = testIterations;
		while (i--) {
			const randomValue = randomInt(min, max);
			if (!map.has(randomValue)) map.set(randomValue, 1);
			else map.set(randomValue, map.get(randomValue) + 1);
		}
		const call = `randomInt(${min}, ${max})`;
		for (let val = min; val <= max; val++) {
			assert(map.has(val), `Result ${val} missing from ${testIterations} of ${call}`);
		}
		const keys = Array.from(map.keys());
		const unwantedKeys = keys.filter(key => typeof(+key) !== "number" || key < min || key > max);
		assert(unwantedKeys.length === 0, `Unexpected results from ${call}: ${unwantedKeys}`);
		const minResult = Math.min(...keys);
		assert(minResult === min, `Min result of ${call} is ${minResult} instead of ${min}`);
		const maxResult = Math.max(...keys);
		assert(maxResult === max, `Max result of ${call} is ${maxResult} instead of ${max}`);
	});
}, true);
