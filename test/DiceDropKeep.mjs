import { assert, runTests } from "@rsc-utils/test-utils";
import { DiceDropKeep, DiceDropKeepType, strike } from "../build/index.js";

// rio => RollIndexOutput = { roll, index, output }

/** Adjusts the count baed on the ddk values. */
function adjustCount(ddk, rolls) { return ddk.adjustCount(rolls.length); }

/** Adjusts the sum baed on the ddk values. */
function adjustSum(ddk, rolls) { return ddk.adjustSum(rolls.map(rio => rio.roll)); }

/** Clones the rolls so we can keep using the same starting data. */
function cloneRolls(rolls) { return rolls.map(rio => ({...rio})); }

/** Creates indexed rolls for testing. */
function indexRoll(roll, index) { return { index, roll, output:String(roll) }; }

/** Clones and sorts the rolls for testing. */
function sortRolls(rolls) { return DiceDropKeep.sort(cloneRolls(rolls)); }

/** Clones and strikes rolls based on the ddk values. */
function strikeDropped(ddk, rolls) { const cloned = cloneRolls(rolls); ddk.strikeDropped(cloned); return cloned; }

/** Used to strike known indexes to create data to test internal logic against. */
function strikeIndex(rolls, ...indexes) {
	const cloned = cloneRolls(rolls);
	cloned.forEach(rio => {
		if (indexes.includes(rio.index)) {
			rio.output = strike(rio.output);
		}
	});
	return cloned;
}

runTests(async function testDiceDropKeep() {
	const rolls = [4, 1, 6, 3, 1].map(indexRoll);

	const sortedRolls = [
		indexRoll(1, 1),
		indexRoll(1, 4),
		indexRoll(3, 3),
		indexRoll(4, 0),
		indexRoll(6, 2),
	];
	assert(sortedRolls, sortRolls, rolls);

	const ddkData = DiceDropKeep.parse();
	const ddk = new DiceDropKeep(ddkData);
	assert(5, adjustCount, ddk, rolls);
	assert(15, adjustSum, ddk, rolls);
	assert(strikeIndex(rolls), strikeDropped, ddk, rolls);
	assert(ddkData, () => ddk.toJSON());
	assert("", () => ddk.toString());

	const ddkDataDL1 = DiceDropKeep.parse({ key:"dropKeep", matches:["dl", 1] });
	ddkDataDL1.alias = "luck";
	const ddkDL1 = new DiceDropKeep(ddkDataDL1);
	assert(4, adjustCount, ddkDL1, rolls);
	assert(14, adjustSum, ddkDL1, rolls);
	assert(strikeIndex(rolls, 1), strikeDropped, ddkDL1, rolls);
	assert(ddkDataDL1, () => ddkDL1.toJSON());
	assert("(luck)", () => ddkDL1.toString());

	const ddkDH1 = new DiceDropKeep(DiceDropKeep.parse({ key:"dropKeep", matches:["dh", 1] }));
	assert(4, adjustCount, ddkDH1, rolls);
	assert(9, adjustSum, ddkDH1, rolls);
	assert(strikeIndex(rolls, 2), strikeDropped, ddkDH1, rolls);
	assert("dh 1", () => ddkDH1.toString());

	const ddkKL1 = new DiceDropKeep(DiceDropKeep.parse({ key:"dropKeep", matches:["kl", 1] }));
	assert(1, adjustCount, ddkKL1, rolls);
	assert(1, adjustSum, ddkKL1, rolls);
	assert(strikeIndex(rolls, 0, 2, 3, 4), strikeDropped, ddkKL1, rolls);
	assert("kl 1", () => ddkKL1.toString());

	const ddkKH1 = new DiceDropKeep(DiceDropKeep.parse({ key:"dropKeep", matches:["kh", 1] }));
	assert(1, adjustCount, ddkKH1, rolls);
	assert(6, adjustSum, ddkKH1, rolls);
	assert(strikeIndex(rolls, 0, 1, 3, 4), strikeDropped, ddkKH1, rolls);
	assert("-kh 1$", () => ddkKH1.toString("-", "$"));
}, true);