import { assert, runTests } from "@rsc-utils/test-utils";
import { doSimple } from "../../build/index.js";

runTests(async function test_doSimple() {
	const tests = [
		["2","2"],
		["1+2","3"],
		[" 1 + 2 ","3"],
		["3(2-1)","3"],
		[" 3 ( 2 - 1 )","3"],
		[" 3 ( 2 -- 1 )","9"],
		[" 3 ( 2 - - - 1 )","3"],
		[" 3 ( 2 - + - 1 )","9"],
		["5*6(1+2)","90"],
		["5 * 6 ( 1 + 2 )","90"],
		["2^2","4"],
		[" 2^  2","4"],
		["2^3","8"],
		["2^4","16"],
		["2^(2*2)","16"],
		["2 ^ ( 2* 2 )","16"],
	];
	tests.forEach(([input,expected]) => {
		assert(String(expected), doSimple, input);
	})
}, true);