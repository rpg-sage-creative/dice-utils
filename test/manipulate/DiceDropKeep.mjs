import { debug } from "@rsc-utils/core-utils";
import { assert, runTests } from "@rsc-utils/core-utils";
import { Dice, DicePart, DiceDropKeep,  markAsDropped, DiceGroup } from "../../build/index.js";

/** Roll fixed roll dice part with the given DiceDropKeep */
function rollAndReturn(ddkString = "") {
	const dicePart = DiceGroup.parse(`(4,1,6,3,1)5d6${ddkString}`).roll().primary.primary;
	const dropKeep = dicePart.manipulation?.find(m => m.dropKeep)?.dropKeep;
	return [ dicePart, dicePart.sortedRollData, dropKeep ];
}

function rollCount(sortedData) { return sortedData.count; }
function rollSum(sortedData) { return sortedData.sum; }

runTests(async function test_DiceDropKeep() {

	const [ dp, data, ddk ] = rollAndReturn();
	assert(5, rollCount, data);
	assert(15, rollSum, data);
	assert(undefined, () => ddk);
	assert("", () => ddk?.toString() ?? "");

	const [ dpDL1, dataDL1, ddkDL1 ] = rollAndReturn("dl1");
	assert(4, rollCount, dataDL1);
	assert(14, rollSum, dataDL1);

	const [ dpDH1, dataDH1, ddkDH1 ] = rollAndReturn("dh1");
	assert(4, rollCount, dataDH1);
	assert(9, rollSum, dataDH1);

	const [ dpKL1, dataKL1, ddkKL1 ] = rollAndReturn("kl1");
	assert(1, rollCount, dataKL1);
	assert(1, rollSum, dataKL1);

	const [ dpKH1, dataKH1, ddkKH1 ] = rollAndReturn("kh1");
	assert(1, rollCount, dataKH1);
	assert(6, rollSum, dataKH1);

}, true);