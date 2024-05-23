import { debug, info, warn } from "@rsc-utils/console-utils";
import { assert, runTests, startAsserting, stopAsserting } from "@rsc-utils/test-utils";
import { randomItem } from "../../build/index.js";

runTests(function testRandomItem() {
	// 1000 iterations wasn't enough to always hit all 1s or all 4s in 5d4!!!!
	const testIterations = 10000;

	const map = new Map();
	const values = ["a", 2, { three:"FOUR" }, "five", 6, "7"];
	let i = testIterations;
	while (i--) {
		const randomValue = randomItem(values);
		if (!map.has(randomValue)) map.set(randomValue, 1);
		else map.set(randomValue, map.get(randomValue) + 1);
	}
	const call = `randomItem(values = ["a", 2, { three:"FOUR" }, "five", 6, "7"])`;
	for (const val of values) {
		assert(map.has(val), `Result ${JSON.stringify(val)} missing from ${testIterations} of ${call}`);
	}
	const keys = Array.from(map.keys());
	const unwantedKeys = keys.filter(key => values.indexOf(key) < 0);
	assert(unwantedKeys.length === 0, `Unexpected results from ${testIterations} of ${call}: ${unwantedKeys}`);
}, true);
