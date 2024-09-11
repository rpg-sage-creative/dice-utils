import { assert, runTests } from "@rsc-utils/core-utils";
import { getNumberRegex } from "../../build/index.js";

function testNumberRegex(value, options) {
	const regex = getNumberRegex(options);
	const match = regex.exec(value);
	return match?.[0];
}

runTests(async function test_getNumberRegex() {
	const tests = [
		"2",
		"+2",
		"-2",
		"+2.0",
		"-2.0",
	];

	tests.forEach(value => {
		assert(value, testNumberRegex, value);
		assert(value, testNumberRegex, value, { anchored:true });
		assert(value, testNumberRegex, value, { anchored:false });

		assert(value, testNumberRegex, ` ${value} `);
		assert(undefined, testNumberRegex, ` ${value} `, { anchored:true });
		assert(value, testNumberRegex, ` ${value} `, { anchored:false });
	});

}, true);