import { DieRollGrade } from "../../../../grade.js";
/**
 * Grades the entire roll by grading each roll based on if it was an exploded roll or not.
 * Returns the grade along with the different counts.
 */
export declare function gradeCnCRoll(baseValues: number[], explodedValues: number[], vs: number): [DieRollGrade, number[]];
