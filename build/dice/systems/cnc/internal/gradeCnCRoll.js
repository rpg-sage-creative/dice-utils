import { DieRollGrade } from "../../../../grade.js";
function gradeCnCDie(value, vs) {
    if (value === 12) {
        return DieRollGrade.CriticalSuccess;
    }
    else if (value >= vs) {
        return DieRollGrade.Success;
    }
    else if (value > 1) {
        return DieRollGrade.Failure;
    }
    else if (value === 1) {
        return DieRollGrade.CriticalFailure;
    }
    else {
        return DieRollGrade.Unknown;
    }
}
export function gradeCnCRoll(baseValues, explodedValues, vs) {
    const values = [
        0,
        0,
        0,
        0,
        0,
        0
    ];
    baseValues.forEach(value => {
        const grade = gradeCnCDie(value, vs);
        values[grade]++;
        switch (grade) {
            case DieRollGrade.CriticalSuccess:
            case DieRollGrade.Success:
                values[0] += 1;
                break;
            case DieRollGrade.CriticalFailure:
                values[0] -= 1;
                break;
        }
    });
    explodedValues.forEach(value => {
        const grade = gradeCnCDie(value, vs);
        if (grade === DieRollGrade.CriticalSuccess) {
            values[DieRollGrade.CriticalSuccess]++;
            values[5] += 2;
        }
        else {
            values[DieRollGrade.Success]++;
            values[5] += 1;
        }
    });
    const totalSuccesses = values[0] + values[5];
    let grade;
    if (totalSuccesses === 0) {
        grade = DieRollGrade.Failure;
    }
    else if (totalSuccesses < 0) {
        grade = DieRollGrade.CriticalFailure;
    }
    else {
        grade = DieRollGrade.Success;
    }
    return [grade, values];
}
