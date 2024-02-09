import { debug, info, warn, error } from "@rsc-utils/console-utils";
import { assert, runTests, startAsserting, stopAsserting } from "@rsc-utils/test-utils";
import { DiceThreshold } from "../../build/index.js";

runTests(async function testDiceThreshold() {

	const lt2 = DiceThreshold.from({ key:"threshold", matches:["lt","2"], token:"lt2" });
	const lt2Updated = lt2.update([1,1,3,3,5,5]);
	assert([2,2,3,3,5,5], () => lt2Updated);

	const ht5 = DiceThreshold.from({ key:"threshold", matches:["ht","5"], token:"ht5" });
	const ht5Updated = ht5.update([2,2,4,4,6,6]);
	assert([2,2,4,4,5,5], () => ht5Updated);
}, true);