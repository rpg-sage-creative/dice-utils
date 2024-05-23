import { DiceTest, DiceTestType } from "../../../DiceTest.js";
export function targetDataToTestData(targetData) {
    if (targetData) {
        return DiceTest.createData(DiceTestType.GreaterThan, targetData.value, targetData.hidden, "vs");
    }
    return undefined;
}
