import { assert, runTests } from "@rsc-utils/core-utils";
import { sum } from "../build/index.js";

runTests(async function test_sum() {
	assert(-1, sum, [1, 2, -3, -4, 3]);
	assert(10, sum, [1, 2, 3, 4]);
}, true);