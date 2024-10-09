import { assert, runTests } from "@rsc-utils/core-utils";
import { doComplex } from "../../build/index.js";

runTests(async function test_doComplex() {
	const tests = [
		["2(3+4)","2*7"],
		["floor(1.2)","1"],
		["min(1,2)","1"],
		["ceil(1.2)","2"],
		["max(1,2)","2"],
		["round(1.2)","1"],
	];
	const mixedTests = [
		["2(||3||+4)","||2*7||"],
		["2(||3+4||)","||2*7||"],
		["floor(||1.2||)","||1||"],
		["min(||1||,2)","||1||"],
		["ceil(||1.2||)","||2||"],
		["max(1,||2||)","||2||"],
		["round(||1.2||)","||1||"],
	];
	const spoiledTests = [
		[" floor(||1.2||) "," ||1|| "],
		[" bob min(||1||,||2||) villa "," bob ||1|| villa "],
		["ceil(||1.2||)","||2||"],
		["max(||1||,||2||)","||2||"],
		["round(||1.2||)","||1||"],
	];

	tests.forEach(([input,expected]) => {
		assert(String(expected), doComplex, input);
		assert(input, doComplex, input, { spoilers:true });
		assert(String(expected), doComplex, input, { spoilers:"optional" });
	});
	mixedTests.forEach(([input,expected]) => {
		assert(input, doComplex, input);
		assert(expected, doComplex, input, { spoilers:"optional" });
	});
	spoiledTests.forEach(([input,expected]) => {
		assert(input, doComplex, input);
		assert(expected, doComplex, input, { spoilers:true });
		assert(expected, doComplex, input, { spoilers:"optional" });
	});

}, true);