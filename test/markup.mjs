import { assert, runTests } from "@rsc-utils/test-utils";
import { bold, italics, strike } from "../build/index.js";

runTests(async function testMarkup() {
	const values = ["15", 15];
	const tests = [["b", bold], ["i", italics], ["s", strike]];
	tests.forEach(([tag, fn]) => {
		values.forEach(val => {
			assert(`<${tag}>${val}</${tag}>`, fn, val);
		});
	});
}, true);