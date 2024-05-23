import { DieRollGrade } from "../../../../grade.js";
import { gradeDie } from "./gradeDie.js";
export function gradeRoll(baseValues, explodedValues, vs) {
    const values = [
        0,
        0,
        0,
        0,
        0,
        0
    ];
    baseValues.forEach(value => {
        const grade = gradeDie(value, vs);
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
        const grade = gradeDie(value, vs);
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
