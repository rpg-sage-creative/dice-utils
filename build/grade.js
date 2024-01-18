import { DiceTest } from "./DiceTest";
export var DieRollGrade;
(function (DieRollGrade) {
    DieRollGrade[DieRollGrade["Unknown"] = 0] = "Unknown";
    DieRollGrade[DieRollGrade["CriticalFailure"] = 1] = "CriticalFailure";
    DieRollGrade[DieRollGrade["Failure"] = 2] = "Failure";
    DieRollGrade[DieRollGrade["Success"] = 3] = "Success";
    DieRollGrade[DieRollGrade["CriticalSuccess"] = 4] = "CriticalSuccess";
})(DieRollGrade || (DieRollGrade = {}));
const DieRollGradeEmojis = [undefined, "[critical-failure]", "[failure]", "[success]", "[critical-success]"];
export function isGradeSuccess(grade) {
    return grade === DieRollGrade.Success || grade === DieRollGrade.CriticalSuccess;
}
export function isGradeFailure(grade) {
    return grade === DieRollGrade.Failure || grade === DieRollGrade.CriticalFailure;
}
export function increaseGrade(grade) {
    return ensureGrade(grade + 1, grade);
}
export function decreaseGrade(grade) {
    return ensureGrade(grade - 1, grade);
}
function ensureGrade(grade, defaultGrade) {
    return grade && DieRollGrade[grade] ? grade : defaultGrade;
}
export function gradeToEmoji(grade) {
    return grade ? DieRollGradeEmojis[grade] : undefined;
}
function booleanToGrade(value) {
    switch (value) {
        case true: return DieRollGrade.Success;
        case false: return DieRollGrade.Failure;
        default: return DieRollGrade.Unknown;
    }
}
export function gradeRoll(roll) {
    return booleanToGrade(DiceTest.test(roll));
}
