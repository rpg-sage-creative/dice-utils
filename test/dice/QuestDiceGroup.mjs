import { debug } from "@rsc-utils/console-utils";
import { assert, runTests } from "@rsc-utils/test-utils";
import { QuestDiceGroup } from "../../build/index.js";

function toDiceString(dg) { return dg.toDiceString(); }
function roll(dg) { return dg.roll().toRollString(); }

runTests(async function test_QuestDiceGroup() {

	[
		["d20", "[1d20]"],
		["1d20", "[1d20]"],
	].forEach(([input, output]) => {
		const diceGroup = QuestDiceGroup.parse(input);
		assert(output, toDiceString, diceGroup);
	});

	// [
	// 	["(1,6,9)3d12", ""],
	// 	["(1,6,9)3d12vs8", ""],
	// 	["(12,6,9)3d12", ""],
	// ].forEach(([input, output]) => {
	// 	const diceGroup = CnCDiceGroup.parse(input);
	// 	assert(output, roll, diceGroup);
	// });

}, true);