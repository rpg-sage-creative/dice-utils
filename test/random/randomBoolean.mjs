import { debug, info, warn } from "@rsc-utils/core-utils";
import { assert, runTests, startAsserting, stopAsserting } from "@rsc-utils/core-utils";
import { randomBoolean } from "../../build/index.js";

runTests(function test_randomBoolean() {
	// 1000 iterations wasn't enough to always hit all 1s or all 4s in 5d4!!!!
	const testIterations = 10000;

	const map = new Map();
	let i = testIterations;
	while (i--) {
		const randomValue = randomBoolean();
		if (!map.has(randomValue)) map.set(randomValue, 1);
		else map.set(randomValue, map.get(randomValue) + 1);
	}
	assert(map.has(true), `Result true missing from ${testIterations} of randomBoolean()`);
	assert(map.has(false), `Result false missing from ${testIterations} of randomBoolean()`);
	const keys = Array.from(map.keys());
	const unwantedKeys = keys.filter(key => key !== true && key !== false);
	assert(unwantedKeys.length === 0, `Unexpected results from ${testIterations} of randomBoolean(): ${unwantedKeys}`);
}, true);
