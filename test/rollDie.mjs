import { assert, runTests, startAsserting } from "@rsc-utils/test-utils";
import { rollDie } from "../build/index.js";

runTests(async function testRollDie() {
	const dice = [2, 3, 4, 6, 8, 10, 12, 20, 30];
	for (const sides of dice) {
		const results = new Array(sides);
		results.fill(false);
		for (let i = 0; i < 10000; i++) {
			const result = rollDie(sides);
			if (result < 1 || result > sides) assert(false, `d${sides} rolled a ${result}`);
			results[result - 1] = true;
			if (!results.includes(false)) break;
		}
		startAsserting(`d${sides}`);
		assert(false, () => results.includes(false));
	}
}, true);