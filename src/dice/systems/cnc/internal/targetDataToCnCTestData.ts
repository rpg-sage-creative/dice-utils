import { DiceTest, DiceTestType, type DiceTestData } from "../../../../DiceTest.js";
import type { TargetType } from "./TargetType.js";

export function targetDataToCnCTestData(targetData?: DiceTestData<TargetType>): DiceTestData | undefined {
	if (targetData) {
		return DiceTest.createData(DiceTestType.GreaterThanOrEqual, targetData.value, targetData.hidden, "vs");
	}
	return undefined;
	// do we assume a default?
	// return DiceTest.createData(DiceTestType.GreaterThanOrEqual, 8, false, "vs");
}