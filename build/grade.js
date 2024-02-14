export var DieRollGrade;
(function (DieRollGrade) {
    DieRollGrade[DieRollGrade["Unknown"] = 0] = "Unknown";
    DieRollGrade[DieRollGrade["CriticalFailure"] = 1] = "CriticalFailure";
    DieRollGrade[DieRollGrade["Failure"] = 2] = "Failure";
    DieRollGrade[DieRollGrade["Success"] = 3] = "Success";
    DieRollGrade[DieRollGrade["CriticalSuccess"] = 4] = "CriticalSuccess";
})(DieRollGrade || (DieRollGrade = {}));
const DieRollGradeEmojis = [undefined, "[critical-failure]", "[failure]", "[success]", "[critical-success]"];
function isValid(grade) {
    return [1, 2, 3, 4].includes(grade);
}
export function isGradeCritical(grade) {
    return grade === DieRollGrade.CriticalFailure || grade === DieRollGrade.CriticalSuccess;
}
export function isGradeSuccess(grade) {
    return grade === DieRollGrade.Success || grade === DieRollGrade.CriticalSuccess;
}
export function isGradeFailure(grade) {
    return grade === DieRollGrade.Failure || grade === DieRollGrade.CriticalFailure;
}
export function increaseGrade(grade) {
    return isValid(grade) ? ensureGrade(grade + 1, grade) : DieRollGrade.Unknown;
}
export function decreaseGrade(grade) {
    return isValid(grade) ? ensureGrade(grade - 1, grade) : DieRollGrade.Unknown;
}
function ensureGrade(modifiedGrade, originalGrade) {
    return isValid(modifiedGrade) ? modifiedGrade : originalGrade;
}
export function gradeToEmoji(grade, _hasTest) {
    return isValid(grade) ? DieRollGradeEmojis[grade] : undefined;
}
export function gradeRoll(dice) {
    const result = dice.test.test(dice.total);
    if (result === true) {
        return DieRollGrade.Success;
    }
    if (result === false) {
        return DieRollGrade.Failure;
    }
    return DieRollGrade.Unknown;
}
