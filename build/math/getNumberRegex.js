import { xRegExp } from "../internal/xRegExp.js";
export function getNumberRegex(options) {
    let capture = `?:`;
    if (options?.capture) {
        capture = options.capture === true ? `` : `?<${options.capture}>`;
    }
    const { leftAnchor = "", rightAnchor = "" } = options?.anchored ? { leftAnchor: "^", rightAnchor: "$" } : {};
    const flags = options?.globalFlag ? "xg" : "x";
    const numberRegex = `
		[+-]?         # optional pos/neg sign
		\\d+          # integer portion
		(?:\\.\\d+)?  # optional decimal portion
	`;
    if (options?.allowSpoilers) {
        const spoileredRegex = `\\|\\|${numberRegex}\\|\\|`;
        return xRegExp(`${leftAnchor}(${capture}${numberRegex}|${spoileredRegex})${rightAnchor}`, flags);
    }
    return xRegExp(`${leftAnchor}(${capture}${numberRegex})${rightAnchor}`, flags);
}
