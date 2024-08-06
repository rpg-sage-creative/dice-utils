import { tokenize } from "../internal/tokenize.js";
import { doMathFunctions } from "../math/doMathFunctions.js";
import { doSimple } from "../math/doSimple.js";
import { getDiceRegex } from "../token/getDiceRegex.js";
export function doStatMath(value) {
    const hasPipes = (/\|{2}[^|]+\|{2}/).test(value);
    const unpiped = value.replace(/\|{2}/g, "");
    const tokens = tokenize(unpiped, { dice: getDiceRegex() });
    const processedTokens = tokens.map(({ token, key }) => key === "dice" ? token : doMathFunctions(token));
    const processed = processedTokens.join("");
    const simpleValue = doSimple(processed);
    if (simpleValue !== undefined) {
        return hasPipes ? `||${simpleValue}||` : simpleValue;
    }
    if (processed !== unpiped) {
        return hasPipes ? `||${processed}||` : processed;
    }
    return value;
}
