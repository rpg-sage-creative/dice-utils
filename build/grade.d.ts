import type { TDice } from "./dice/Dice.js";
export declare enum DieRollGrade {
    Unknown = 0,
    CriticalFailure = 1,
    Failure = 2,
    Success = 3,
    CriticalSuccess = 4
}
type TDieRollGradeEmoji = undefined | "[critical-success]" | "[success]" | "[failure]" | "[critical-failure]";
/** Returns true if critical failure or critical success. */
export declare function isGradeCritical(grade: DieRollGrade): boolean;
/** Returns true if success or critical success. */
export declare function isGradeSuccess(grade: DieRollGrade): boolean;
/** Returns true if failure or critical failure. */
export declare function isGradeFailure(grade: DieRollGrade): boolean;
/** Increases the grade by 1 without going higher than critical success. */
export declare function increaseGrade(grade: DieRollGrade): DieRollGrade;
/** Descreases the grade by 1 without going lower than critical failure. */
export declare function decreaseGrade(grade: DieRollGrade): DieRollGrade;
/** Returns the bracket name Sage uses for dice results emoji based on the grade. Ex: [success] or [failure] */
export declare function gradeToEmoji(grade: DieRollGrade): TDieRollGradeEmoji;
/** Grades the given dice roll to simple success/failure/unknown. No critical logic. */
export declare function gradeRoll(roll: TDice): DieRollGrade;
export {};
