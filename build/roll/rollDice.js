import { rollDie } from "./rollDie.js";
export function rollDice(count, sides) {
    const rolls = [];
    for (let i = count; i--;) {
        rolls.push(rollDie(sides));
    }
    return rolls;
}
