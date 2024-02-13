import { debug } from "@rsc-utils/console-utils";
import { assert, runTests } from "@rsc-utils/test-utils";
import { Dice, DicePart, DiceDropKeep,  markAsDropped, DiceGroup } from "../../build/index.js";

function createDataAndDdk(type, value, alias) {
	const data = DiceDropKeep.parseData(type && value ? { key:"dropKeep", matches:[type, value] } : undefined);
	if (alias) data.alias = alias;
	const ddk = new DiceDropKeep(data);
	return [data, ddk];
}

/** Create consistent fixed roll DicePart. */
function createFixedRollsPart() {
	return DicePart.create({count:5,sides:6,modifier:0,fixedRolls:[4, 1, 6, 3, 1]});
}

/** Roll fixed roll dice part with the given DiceDropKeep */
function rollAndReturnSortedRollData(ddkString = "") {
	return DiceGroup.parse(`(4, 1, 6, 3, 1)5d6${ddkString}`).roll().primary.primary.sortedRollData;
}

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
	const sortedData = rollAndReturnSortedRollData();
	const sortedDataDL1 = rollAndReturnSortedRollData("dl1");
	debug({ sortedData });
	debug({ sortedDataDL1 });
	assert(false, "Stopping here.");
	// const fixedRollsPart = DicePart.create({count:5,sides:6,modifier:0,fixedRolls:[4, 1, 6, 3, 1]});
	// fixedRollsPart.roll();
	// const sortedRollData = fixedRollsPart.sortedRollData ?? [];
	// const rolls = sortedRollData.byIndex;

	// const [ddkData, ddk] = createDataAndDdk();
	// const sorted = rollAndReturnSortedRollData(ddk);
	// assert(5, manipulatedCount, sorted);
	// assert(15, manipulatedSum, sorted);
	// assert(dropIndex(rolls), markDropped, ddk, rolls);
	// assert(ddkData, () => ddk.toJSON());
	// assert("", () => ddk.toString());

	// const [ddkDataDL1, ddkDL1] = createDataAndDdk("dl", 1, "luck");
	// const sortedDL1 = rollAndReturnSortedRollData(ddk);
	// assert(4, manipulatedCount, sortedDL1);
	// assert(14, manipulatedSum, sortedDL1);
	// assert(dropIndex(rolls, 1), markDropped, ddkDL1, rolls);
	// assert(ddkDataDL1, () => ddkDL1.toJSON());
	// assert("(luck)", () => ddkDL1.toString());

	// const ddkDH1 = DiceDropKeep.from({ key:"dropKeep", matches:["dh", 1] });
	// assert(4, manipulatedCount, ddkDH1, rolls);
	// assert(9, manipulatedSum, ddkDH1, rolls);
	// assert(dropIndex(rolls, 2), markDropped, ddkDH1, rolls);
	// assert("dh 1", () => ddkDH1.toString());

	// const ddkKL1 = DiceDropKeep.from({ key:"dropKeep", matches:["kl", 1] });
	// assert(1, manipulatedCount, ddkKL1, rolls);
	// assert(1, manipulatedSum, ddkKL1, rolls);
	// assert(dropIndex(rolls, 0, 2, 3, 4), markDropped, ddkKL1, rolls);
	// assert("kl 1", () => ddkKL1.toString());

	// const ddkKH1 = DiceDropKeep.from({ key:"dropKeep", matches:["kh", 1] });
	// assert(1, manipulatedCount, ddkKH1, rolls);
	// assert(6, manipulatedSum, ddkKH1, rolls);
	// assert(dropIndex(rolls, 0, 1, 3, 4), markDropped, ddkKH1, rolls);
	// assert("-kh 1$", () => ddkKH1.toString("-", "$"));
}, true);