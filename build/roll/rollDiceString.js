import { sum } from "../sum.js";
import { rollDice } from "./rollDice.js";
export function rollDiceString(diceString) {
    const cleanDiceString = (diceString ?? "").replace(/\s+/g, "");
    if (/^\d+$/.test(cleanDiceString)) {
        return +cleanDiceString;
    }
    const regex = /^([-+])?(\d+)d(\d+)(?:([-+])(\d+))?$/i;
    const match = regex.exec(cleanDiceString);
    if (!match) {
        return null;
    }
    const diceSign = match[1];
    const diceCount = +match[2];
    const diceSides = +match[3];
    if (!diceCount || !diceSides) {
        return null;
    }
    const modifierSign = match[4];
    const modifier = +(match[5] ?? 0);
    const val = sum(rollDice(diceCount, diceSides)) * (diceSign === "-" ? -1 : 1);
    const mod = modifier * (modifierSign === "-" ? -1 : 1);
    return val + mod;
}
