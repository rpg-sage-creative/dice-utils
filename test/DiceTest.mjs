import { assert, runTests } from "@rsc-utils/core-utils";
import { DiceTest } from "../build/index.js";

function test(token, five, ten, fifteen) {
	const dt = DiceTest.from(token);
	assert(five, () => dt.test(5));
	assert(ten, () => dt.test(10));
	assert(fifteen, () => dt.test(15));
}

runTests(async function test_DiceTest() {

	[{ }].forEach(token => test(token));

	[
		{ key:"test", matches:["=","10"], token:"=10" },
		{ key:"test", matches:["eq","10"], token:"eq10" },
	]
	.forEach(token => test(token, false, true, false));

	[
		{ key:"test", matches:[">","10"], token:">10" },
		{ key:"test", matches:["gt","10"], token:"gt10" },
	]
	.forEach(token => test(token, false, false, true));

	[
		{ key:"test", matches:[">=","10"], token:">=10" },
		{ key:"test", matches:["gte","10"], token:"gte10" },
		{ key:"test", matches:["gteq","10"], token:"gteq10" },
	]
	.forEach(token => test(token, false, true, true));

	[
		{ key:"test", matches:["<","10"], token:"<10" },
		{ key:"test", matches:["lt","10"], token:"lt10" },
	]
	.forEach(token => test(token, true, false, false));

	[
		{ key:"test", matches:["<=","10"], token:"<=10" },
		{ key:"test", matches:["lte","10"], token:"lte10" },
		{ key:"test", matches:["lteq","10"], token:"lteq10" },
	]
	.forEach(token => test(token, true, true, false));

}, true);