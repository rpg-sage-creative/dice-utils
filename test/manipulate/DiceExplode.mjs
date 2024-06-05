import { debug } from "@rsc-utils/core-utils";
import { assert, runTests } from "@rsc-utils/core-utils";
import { DiceExplode, DiceGroup } from "../../build/index.js";

/** Roll fixed roll dice part with the given DiceExplode */
function rollAndReturn(rolls, xString = "") {
	const dicePart = DiceGroup.parse(`(${rolls})${rolls.length}d6${xString}`).roll().primary.primary;
	const explode = dicePart.manipulation?.find(m => m.explode)?.explode;
	return [ dicePart, dicePart.sortedRollData, explode ];
}

runTests(async function test_DiceExplode() {

	const [ dicePartNoExplode, dataNoExplode, explodeNoExplode ] = rollAndReturn([1,2,3,4,5,6]);
	assert(dataNoExplode.count === dataNoExplode.initialCount, `oneSix exploded wrong: ${dataNoExplode.byIndex.slice(6).map(r => r.text)}`);

	for (let i = 0; i < 10; i++) {
		const [ dicePart5up, data5up, explode5up ] = rollAndReturn([1,2,3,4,5,6], "x>=5");
		const data5upUn = data5up.byIndex.filter(r => r.initialValue < 5).length;
		assert(data5upUn === 6, `exploder5up exploded wrong: ${data5up.byIndex.slice(6).map(r => r.text)}`);
	}

	for (let i = 0; i < 10; i++) {
		const [ dicePartOver4, dataOver4, explodeOver4 ] = rollAndReturn([1,2,3,4,5,6], "x>4");
		const dataOver4Un = dataOver4.byIndex.filter(r => r.initialValue < 5).length;
		assert(dataOver4Un === 6, `moreOver4 exploded wrong: ${dataOver4.byIndex.slice(6).map(r => r.text)}`);
	}

	const [ dicePartTwoSixes, dataTwoSixes, explodeTwoSixes ] = rollAndReturn([2,4,6,6], "x");
		const dataTwoSixesUn = dataTwoSixes.byIndex.filter(r => r.initialValue < 6).length;
		assert(dataTwoSixesUn === 4, `twoSixes exploded wrong: ${dataTwoSixes.byIndex.slice(4).map(r => r.text)}`);

}, true);