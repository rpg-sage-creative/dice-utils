import { Dice } from "../../../../dice/Dice.js";
export function gradeToEmoji(grade, vs) {
    if (vs) {
        return Dice.gradeToEmoji(grade) ?? `:question:`;
    }
    return Dice.gradeToEmoji(grade) ?? `:bangbang:`;
}
