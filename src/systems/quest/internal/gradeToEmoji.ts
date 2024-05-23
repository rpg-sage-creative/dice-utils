import { Dice } from "../../../dice/Dice.js";
import type { DieRollGrade } from "../../../grade.js";

export function gradeToEmoji(grade: DieRollGrade, vs?: boolean): string | undefined {
	if (vs) {
		return Dice.gradeToEmoji(grade) ?? `:question:`;
	}
	return Dice.gradeToEmoji(grade) ?? `:bangbang:`;
}