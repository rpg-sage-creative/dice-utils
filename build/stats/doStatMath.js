import { tokenize } from "../internal/tokenize.js";
import { getComplexRegex } from "../math/internal/doComplex.js";
import { processMath } from "../math/processMath.js";
export function doStatMath(value) {
    const tokens = tokenize(value, { complex: getComplexRegex({ spoilers: "optional" }) });
    const processed = tokens.map(({ token, key }) => key === "complex" ? processMath(token, { spoilers: "optional" }) : token);
    return processed.join("");
}
