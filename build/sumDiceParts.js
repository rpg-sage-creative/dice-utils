import { sum } from "./sum.js";
export function sumDiceParts(diceParts) {
    const mathParts = [];
    diceParts.forEach(dp => {
        mathParts.push(dp.sign ?? "+", dp.total);
    });
    const valuesToAdd = [];
    let valueToAdd = 0;
    while (mathParts.length) {
        const sign = mathParts.shift();
        const value = mathParts.shift();
        if (sign === "-" || sign === "+") {
            valuesToAdd.push(valueToAdd);
            valueToAdd = value;
        }
        else if (sign === "*") {
            valueToAdd *= value;
        }
        else {
            valueToAdd /= value;
        }
    }
    valuesToAdd.push(valueToAdd);
    return sum(valuesToAdd);
}
