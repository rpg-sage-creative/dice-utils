import { assert, runTests } from "@rsc-utils/core-utils";
import { cleanSigns } from "../../build/index.js";

runTests(async function test_cleanSigns() {
	const tests = [
		["2","2"],
		["+2","+2"],
		["-+2","-2"],
		["-+-2","+2"],
		["--2","+2"],
		["---2","-2"],
		["- -2 + - 4","+2 - 4"],
	];
	tests.forEach(([input,expected]) => {
		assert(String(expected), cleanSigns, input);
	})
}, true);