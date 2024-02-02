import { assert, runTests } from "@rsc-utils/test-utils";
import { DiceDropKeep, createSortedRollData, markAsDropped } from "../build/index.js";


/** Adjusts the count baed on the ddk values. */
function adjustCount(ddk, rolls) { return ddk.adjustCount(rolls.length); }

/** Adjusts the sum baed on the ddk values. */
function adjustSum(ddk, rolls) { return ddk.adjustSum(rolls.map(rollData => rollData.roll)); }

/** Clones the rolls so we can keep using the same starting data. */
function cloneRollData(rolls) { return rolls.map(rollData => ({...rollData})); }

/** Clones and strikes rolls based on the ddk values. */
function markDropped(ddk, rolls) { const cloned = cloneRollData(rolls); ddk.markDropped(cloned); return cloned; }

/** Used to strike known indexes to create data to test internal logic against. */
function dropIndex(rolls, ...indexes) {
	const cloned = cloneRollData(rolls);
	cloned.forEach(rollData => {
		if (indexes.includes(rollData.index)) {
			rollData.isDropped = true;
			rollData.output = markAsDropped(rollData.output);
		}
	});
	return cloned;
}

runTests(async function testDiceDropKeep() {
	const sortedRollData = createSortedRollData({ dice:{ fixedRolls:[], sides:6 }, rolls:[4, 1, 6, 3, 1] });
	const rolls = sortedRollData.byIndex;

	const ddkData = DiceDropKeep.parse();
	const ddk = new DiceDropKeep(ddkData);
	assert(5, adjustCount, ddk, rolls);
	assert(15, adjustSum, ddk, rolls);
	assert(dropIndex(rolls), markDropped, ddk, rolls);
	assert(ddkData, () => ddk.toJSON());
	assert("", () => ddk.toString());

	const ddkDataDL1 = DiceDropKeep.parse({ key:"dropKeep", matches:["dl", 1] });
	ddkDataDL1.alias = "luck";
	const ddkDL1 = new DiceDropKeep(ddkDataDL1);
	assert(4, adjustCount, ddkDL1, rolls);
	assert(14, adjustSum, ddkDL1, rolls);
	assert(dropIndex(rolls, 1), markDropped, ddkDL1, rolls);
	assert(ddkDataDL1, () => ddkDL1.toJSON());
	assert("(luck)", () => ddkDL1.toString());

	const ddkDH1 = new DiceDropKeep(DiceDropKeep.parse({ key:"dropKeep", matches:["dh", 1] }));
	assert(4, adjustCount, ddkDH1, rolls);
	assert(9, adjustSum, ddkDH1, rolls);
	assert(dropIndex(rolls, 2), markDropped, ddkDH1, rolls);
	assert("dh 1", () => ddkDH1.toString());

	const ddkKL1 = new DiceDropKeep(DiceDropKeep.parse({ key:"dropKeep", matches:["kl", 1] }));
	assert(1, adjustCount, ddkKL1, rolls);
	assert(1, adjustSum, ddkKL1, rolls);
	assert(dropIndex(rolls, 0, 2, 3, 4), markDropped, ddkKL1, rolls);
	assert("kl 1", () => ddkKL1.toString());

	const ddkKH1 = new DiceDropKeep(DiceDropKeep.parse({ key:"dropKeep", matches:["kh", 1] }));
	assert(1, adjustCount, ddkKH1, rolls);
	assert(6, adjustSum, ddkKH1, rolls);
	assert(dropIndex(rolls, 0, 1, 3, 4), markDropped, ddkKH1, rolls);
	assert("-kh 1$", () => ddkKH1.toString("-", "$"));
}, true);