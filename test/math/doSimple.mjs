import { assert, runTests } from "@rsc-utils/core-utils";
import { doSimple } from "../../build/index.js";

runTests(async function test_doSimple() {
	// PEMDAS
	const unspoiledTests = [
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
		["2+10/2-2*2", "3"],
	];
	unspoiledTests.forEach(([input,expected]) => {
		assert(expected, doSimple, input);
		assert(input, doSimple, input, { spoilers:true });
		assert(expected, doSimple, input, { spoilers:"optional" });
	});

	const spoiledTests = [
		["||2||"],
		["1+||2||",null,"||3||"],
		[" 1 + ||2|| ",null," ||3|| "],
		["||2||^2",null,"||4||"],
		[" 2^  ||2||",null," ||4||"],
		["||2||^3",null,"||8||"],
		["||2||^4",null,"||16||"],
		["||4||%3",null,"||1||"],
		[" 5 %||3||",null," ||2||"],
		["4 % ||2||",null,"||0||"],
		["2+10/||2||-2*2", "12/||2||-4",  "||3||"],
		["||2+10/2-2*2||", "||3||",  "||3||"],
		["||2+1||", "||3||",  "||3||"],
		["||2+1||+||3+4||", "||3||+||7||",  "||10||"],
	];
	spoiledTests.forEach(([input,expectedFalse,expectedOptional]) => {
		assert(expectedFalse ?? input, doSimple, input);
		assert(input, doSimple, input, { spoilers:true });
		assert(expectedOptional ?? input, doSimple, input, { spoilers:"optional" });
	});

	const spoiledTrueTests = [
		["||||2||+||3||||", null, "||5||", "||5||"]
	];
	spoiledTrueTests.forEach(([input,expectedFalse,expectedTrue,expectedOptional]) => {
		assert(expectedFalse ?? input, doSimple, input);
		assert(expectedTrue ?? input, doSimple, input, { spoilers:true });
		assert(expectedOptional ?? input, doSimple, input, { spoilers:"optional" });
	});


}, true);