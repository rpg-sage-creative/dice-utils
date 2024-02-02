import { assert, runTests } from "@rsc-utils/test-utils";
import { rollDice, sum } from "../build/index.js";

runTests(async function testRollDice() {
	const count = 3;
	const sides = 6;
	for (let i = 0; i < 10000; i++) {
		const results = rollDice(count, sides);
		const min = Math.min(...results);
		const max = Math.max(...results);
		const total = sum(results);
		// check that no value is less than 1
		assert(1 <= min, `${count}d${sides} rolled a ${min}`);
		assert(sides >= max, `${count}d${sides} rolled a ${max}`);
		assert(false, () => total < count);
		assert(false, () => total > count * sides);
	}
}, true);