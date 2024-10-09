import { tokenize } from "../internal/tokenize.js";
import { processMath } from "../math/processMath.js";
import { getDiceRegex } from "../token/getDiceRegex.js";
export function doStatMath(value) {
    const tokens = tokenize(value, { dice: getDiceRegex() });
    const processed = tokens.map(({ token, key }) => key === "dice" ? token : processMath(token, { spoilers: "optional" }));
    return processed.join("");
}
