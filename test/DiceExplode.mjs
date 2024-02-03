import { debug } from "@rsc-utils/console-utils";
import { assert, runTests } from "@rsc-utils/test-utils";
import { DiceExplode } from "../build/index.js";

runTests(async function testDiceExplode() {

	const oneSix = [1,2,3,4,5,6];
	const oneMore = DiceExplode.explode(6, oneSix);
	assert(oneMore.filter(n => n < 6).length === 1, `oneSix exploded wrong: ${oneMore}.`);

	for (let i = 0; i < 10; i++) {
		const exploder5up = DiceExplode.from({ key:"explode", matches:["x",">=","5"], token:"x>=5" });
		const more5up = exploder5up.explode(6, oneSix);
		assert(more5up.filter(n => n < 5).length === 2, `exploder5up exploded wrong: ${more5up}.`);
	}

	for (let i = 0; i < 10; i++) {
		const exploderOver4 = DiceExplode.from({ key:"explode", matches:["x",">","4"], token:"x>4" });
		const moreOver4 = exploderOver4.explode(6, oneSix);
		assert(moreOver4.filter(n => n < 5).length === 2, `moreOver4 exploded wrong: ${moreOver4}.`);
	}

	const twoSixes = [2,4,6,6];
	const twoMore = DiceExplode.explode(6, twoSixes);
	assert(twoMore.filter(n => n < 6).length === 2, `oneSix exploded wrong.`);

}, true);