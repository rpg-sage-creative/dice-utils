import { assert } from "@rsc-utils/console-utils";
import { rollDiceString } from "../build/rollDiceString.js";

export function testDiceRollString() {
	const testIterations = 10000;

	const validValues = [["-1d6", -6, -1], ["-2d6-2", -14, -4], ["1d6", 1, 6], ["+1d6", 1, 6], ["1d8+1", 2, 9], ["1d20-3", -2, 17], ["3d6", 3, 18], ["5d4+1", 6, 21], ["2d20-3", -1, 37]];
	validValues.forEach(([diceString, min, max]) => {
		const call = `rollDiceString("${diceString}")`;
		const map = new Map();
		let i = testIterations;
		while (i--) {
			const randomValue = rollDiceString(diceString);
			if (!map.has(randomValue)) map.set(randomValue, 1);
			else map.set(randomValue, map.get(randomValue) + 1);
		}
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
	const invalidValues = [["0d1"], ["1d0"]];
	invalidValues.forEach(([diceString]) => {
		assert(rollDiceString(diceString) === null, `Expected a null result: ${diceString}`);
	});
}
