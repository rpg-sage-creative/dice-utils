import { debug } from "@rsc-utils/console-utils";
import { assert, runTests } from "@rsc-utils/test-utils";
import { CnCDiceGroup } from "../../build/index.js";

function toDiceString(dg) { return dg.toDiceString(); }
function roll(dg) { return dg.roll().toRollString(); }

runTests(async function test_CnCDiceGroup() {

	[
		["3d12", "[3d12 x12]"],
		["3d12vs8", "[3d12 x12]"],
		["3d12vs9", "[3d12 x12vs 9]"],
	].forEach(([input, output]) => {
		const diceGroup = CnCDiceGroup.parse(input);
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