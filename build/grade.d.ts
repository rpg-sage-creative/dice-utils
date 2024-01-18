import type { DiceRoll } from "./types/DiceRoll.js";
export declare enum DieRollGrade {
    Unknown = 0,
    CriticalFailure = 1,
    Failure = 2,
    Success = 3,
    CriticalSuccess = 4
}
type TDieRollGradeEmoji = undefined | "[critical-success]" | "[success]" | "[failure]" | "[critical-failure]";
export declare function isGradeSuccess(grade: DieRollGrade): boolean;
export declare function isGradeFailure(grade: DieRollGrade): boolean;
export declare function increaseGrade(grade: DieRollGrade): DieRollGrade;
export declare function decreaseGrade(grade: DieRollGrade): DieRollGrade;
export declare function gradeToEmoji(grade: DieRollGrade): TDieRollGradeEmoji;
export declare function gradeRoll(roll: DiceRoll): DieRollGrade;
export {};
