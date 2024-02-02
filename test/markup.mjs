import { assert, runTests } from "@rsc-utils/test-utils";
import { markAsMax, markAsMin, markAsDropped } from "../build/index.js";

runTests(async function testMarkup() {
	const values = ["15", 15];
	const tests = [["b", markAsMax], ["i", markAsMin], ["s", markAsDropped]];
	tests.forEach(([tag, fn]) => {
		values.forEach(val => {
			assert(`<${tag}>${val}</${tag}>`, fn, val);
		});
	});
}, true);