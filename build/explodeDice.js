import { rollDice } from "./rollDice.js";
export function explodeDice(dieSize, dieValues, ...explodeValues) {
    const explodedValues = [];
    let extra = dieValues.filter(value => explodeValues.includes(value)).length;
    while (extra > 0) {
        const roll = rollDice(1, dieSize)[0];
        explodedValues.push(roll);
        if (!explodeValues.includes(roll)) {
            extra--;
        }
    }
    return explodedValues;
}
