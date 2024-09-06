import { debug, info, warn } from "@rsc-utils/core-utils";
import { assert, runTests, startAsserting, stopAsserting } from "@rsc-utils/core-utils";
import { processMath } from "../../build/index.js"

runTests(async function test_processMath() {
	const tests = [
		["2-2",0],
		["2--2",4],
		["2---2",0],
		["2----2",4],
		["2+2",4],
		["2++2",4],
		["2+++2",4],
		["2++++2",4],
		["min(2-1,0+2)",1],
		["max(1,2)",2],
		["floor(4.5)",4],
		["round(4.4+5)",9],
		["round(4.4*2)",9],
		["round(4.4*-2)",-9],
		["round(-2*4.4)",-9],
		["round(4.5)",5],
		["ceil(4.5)",5],
		["2*(1+3)",8],
		["2*(1+3)^2",32],
		["2(1+3)^2",32],
		[`round( ( min( max( 2-1,2+0 ), 3 ) * floor( ( round(9-4.5) * 0.3 ) + 4 ) ) )`,10],
		[`round( ( min( max( 1,2 ), 3 ) * floor( ( round(4.5) * 0.3 ) + 4 ) ) )`,10],
		[`round( ( min( max( 1,2 ), 3 ) * floor( ( round(4.5) * 0.3 ) + 4 ) ) )`.replace(/\s/g, ""),10],
		[`round( ( min(max(1,2),3) * floor((round(4.5)+0.3)+4) )+1.9 )`,20],
		["round(-4/2)",-2],
		["round(4/-2)",-2],
		["round(-2-2.5)",-4],
		["3^2^2", 81],
		["3(2-1)",3],
		[" 3 ( 2 - 1 )",3],
		[" 3 ( 2 -- 1 )",9],
		[" 3 ( 2 - - - 1 )",3],
		[" 3 ( 2 - + - 1 )",9],
		["5*6(1+2)",90],
		["5 * 6 ( 1 + 2 )",90],
		["2^(2*2)",16],
		["2 ^ ( 2* 2 )",16],
		["(10)1d20", "(10)1d20"],
		["(10)d20", "(10)d20"],
		["1d20 ac (10-2)", "1d20 ac 8"],
	];
	tests.forEach(([input,expected]) => {
		assert(String(expected), processMath, input);
	})
}, true);