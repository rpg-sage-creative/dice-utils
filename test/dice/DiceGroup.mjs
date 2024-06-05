import { debug } from "@rsc-utils/core-utils";
import { assert, runTests } from "@rsc-utils/core-utils";
import { DiceGroup } from "../../build/index.js";

function toDiceString(dg) { return dg.toDiceString(); }

runTests(async function test_DiceGroup() {

	[
		["1d20", "[1d20]"],
		["2d20kh1", "[2d20 kh1]"],
		["3d6x", "[3d6 x6]"],
		["4d6bt2kh3", "[4d6 bt2 kh3]"],
	].forEach(([input, output]) => {
		const diceGroup = DiceGroup.parse(input);
		assert(output, toDiceString, diceGroup);
	});

	// const dg = DiceGroup.parse(`(10)1d20`).roll();
	// assert()
	// debug({
	// 	toDiceString: dg.toDiceString(),
	// 	toRollString: dg.toRollString()
	// });

}, true);