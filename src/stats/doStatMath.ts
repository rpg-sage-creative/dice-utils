import { tokenize } from "../internal/tokenize.js";
import { getComplexRegex } from "../math/internal/doComplex.js";
import { processMath } from "../math/processMath.js";

/**
 * Checks the stat value for math.
 * If no math is found, then the value is returned.
 * If math is found, then it is calculated.
 * If pipes (spoilers) are found then they are removed for calculation and the return value is wrapped in pipes.
 * (Primarily for hiding values, such as AC.)
 */
export function doStatMath(value: string): string {
	// process only complex regex matches
	const tokens = tokenize(value, { complex:getComplexRegex({ spoilers:"optional" }) });
	const processed = tokens.map(({ token, key }) => key === "complex" ? processMath(token, { spoilers:"optional" }) : token);
	return processed.join("");
}