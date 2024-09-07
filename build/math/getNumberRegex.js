import { xRegExp } from "../internal/xRegExp.js";
export function getNumberRegex(options) {
    const flags = options?.globalFlag ? "xg" : "x";
    const numberRegex = `
		[+-]?         # optional pos/neg sign
		\\d+          # integer portion
		(?:\\.\\d+)?  # optional decimal portion
	`;
    if (options?.allowSpoilers) {
        const spoileredRegex = `\\|\\|${numberRegex}\\|\\|`;
        return xRegExp(`(?:${numberRegex}|${spoileredRegex})`, flags);
    }
    return xRegExp(`(?:${numberRegex})`, flags);
}
