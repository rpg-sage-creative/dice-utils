import { assert, runTests } from "@rsc-utils/core-utils";
import { doSimple } from "../../build/index.js";

runTests(async function test_doSimple() {
	// PEMDAS
	const tests = [
		["2","2"],
		["1+2","3"],
		[" 1 + 2 "," 3 "],
		["2^2","4"],
		[" 2^  2"," 4"],
		["2^3","8"],
		["2^4","16"],
		["4%3","1"],
		[" 5 %3"," 2"],
		["4 % 2","0"],
		["2+10/2-2*2", "3"]
	];
	tests.forEach(([input,expected]) => {
		assert(String(expected), doSimple, input);
	})
}, true);