import { tokenize } from "../internal/tokenize.js";
import { processMath } from "../math/processMath.js";
import { doSimple } from "../math/doSimple.js";
import { getDiceRegex } from "../token/getDiceRegex.js";
export function doStatMath(value) {
    const hasPipes = (/\|{2}[^|]+\|{2}/).test(value);
    const unpiped = value.replace(/\|{2}/g, "");
    const tokens = tokenize(unpiped, { dice: getDiceRegex() });
    const processedTokens = tokens.map(({ token, key }) => key === "dice" ? token : processMath(token));
    const processed = processedTokens.join("");
    const simpleValue = doSimple(processed);
    if (simpleValue !== undefined && simpleValue !== null) {
        return hasPipes ? `||${simpleValue}||` : simpleValue;
    }
    if (processed !== unpiped) {
        return hasPipes ? `||${processed}||` : processed;
    }
    return value;
}
