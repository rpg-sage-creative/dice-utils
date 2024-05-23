import { DiceTest, DiceTestType, type DiceTestData } from "../../../DiceTest.js";
import type { TargetType } from "./TargetType.js";

export function targetDataToTestData(targetData?: DiceTestData<TargetType>): DiceTestData | undefined {
	if (targetData) {
		return DiceTest.createData(DiceTestType.GreaterThanOrEqual, targetData.value, targetData.hidden, "vs");
	}
	return undefined;
}