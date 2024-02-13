import { debug, info, warn, error } from "@rsc-utils/console-utils";
import { assert, runTests, startAsserting, stopAsserting } from "@rsc-utils/test-utils";
import { DiceGroup, DiceThreshold } from "../../build/index.js";

/** Roll fixed roll dice part with the given DiceExplode */
function rollAndReturn(rolls, tString = "") {
	const dicePart = DiceGroup.parse(`(${rolls})${rolls.length}d6${tString}`).roll().primary.primary;
	const threshold = dicePart.manipulation?.find(m => m.threshold)?.threshold;
	return [ dicePart, dicePart.sortedRollData, threshold ];
}

runTests(async function testDiceThreshold() {

	const [dpLT2, dataLT2, tLT2] = rollAndReturn([1,1,3,3,5,5], "lt2");
	assert([2,2,3,3,5,5], () => dataLT2.byIndex.map(r => r.threshold??r.value));

	const [dpHT5, dataHT5, tHT5] = rollAndReturn([2,2,4,4,6,6], "ht5");
	assert([2,2,4,4,5,5], () => dataHT5.byIndex.map(r => r.threshold??r.value));

}, true);