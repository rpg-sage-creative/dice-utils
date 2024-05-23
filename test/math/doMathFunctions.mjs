import { debug, info, warn } from "@rsc-utils/console-utils";
import { assert, runTests, startAsserting, stopAsserting } from "@rsc-utils/test-utils";
import { doMathFunctions } from "../../build/index.js"

runTests(async function test_doMathFunctions() {
	const tests = [
		["min(1,2)",1],
		["max(1,2)",2],
		["floor(4.5)",4],
		["round(4.4+5)",9],
		["round(4.5)",5],
		["ceil(4.5)",5],
		["2*(1+3)",8],
		["2*(1+3)^2",32],
		["2(1+3)^2",32],
		[`round( ( min( max( 1,2 ), 3 ) * floor( ( round(4.5) * 0.3 ) + 4 ) ) )`,10],
		[`round( ( min( max( 1,2 ), 3 ) * floor( ( round(4.5) * 0.3 ) + 4 ) ) )`.replace(/\s/g, ""),10],
		[`round( ( min(max(1,2),3) * floor((round(4.5)+0.3)+4) )+1.9 )`,20],
		["round(4/-2)",-2],
		["round(-2-2.5)",-4],
		["3^2^2", 81],
	];
	tests.forEach(([input,expected]) => {
		assert(String(expected), doMathFunctions, input);
	})
}, true);