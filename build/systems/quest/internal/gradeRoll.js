import { DieRollGrade } from "../../../grade.js";
export function gradeRoll(dice) {
    const test = dice.test;
    if (!test.isEmpty) {
        return dice.total > test.value ? DieRollGrade.Success : DieRollGrade.Failure;
    }
    if (dice.total === 20) {
        return DieRollGrade.CriticalSuccess;
    }
    else if (dice.total > 10) {
        return DieRollGrade.Success;
    }
    else if (dice.total > 5) {
        return DieRollGrade.Failure;
    }
    else if (dice.total > 1) {
        return DieRollGrade.CriticalFailure;
    }
    else {
        return DieRollGrade.Unknown;
    }
}
