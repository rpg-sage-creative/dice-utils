import { DieRollGrade } from "../../../../grade.js";
export function gradeCnCDie(value, vs) {
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
