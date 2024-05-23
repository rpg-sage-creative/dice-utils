import { DiceTest, DiceTestType } from "../../../../DiceTest.js";
export function targetDataToCnCTestData(targetData) {
    if (targetData) {
        return DiceTest.createData(DiceTestType.GreaterThanOrEqual, targetData.value, targetData.hidden, "vs");
    }
    return undefined;
}
