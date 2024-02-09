import { rollDie } from "./rollDie.js";
export function rollDiceString(diceString) {
    const cleanDiceString = (diceString ?? "").replace(/\s+/, "");
    const regex = /^([-+])?(\d+)d(\d+)(?:([-+])(\d+))?$/i;
    const match = regex.exec(cleanDiceString);
    if (!match) {
        return null;
    }
    const diceSign = match[1] ?? "+";
    const diceCount = +match[2];
    const diceSides = +match[3];
    if (!diceCount || !diceSides) {
        return null;
    }
    const modifierSign = match[4] ?? "+";
    const modifier = +(match[5] ?? 0);
    let total = modifier * (modifierSign === "+" ? 1 : -1);
    for (let i = 0; i < diceCount; i++) {
        if (diceSign === "+") {
            total += rollDie(diceSides);
        }
        else {
            total -= rollDie(diceSides);
        }
    }
    return total;
}
