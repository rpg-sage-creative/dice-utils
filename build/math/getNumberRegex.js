import XRegExp from "xregexp";
export function getNumberRegex(options) {
    const flags = options?.globalFlag ? "xg" : "x";
    return XRegExp(`
		(?:               # open non-capture group
			[+-]?         # optional pos/neg sign
			\\d+          # integer portion
			(?:\\.\\d+)?  # optional decimal portion
		)                 # close non-capture group
	`, flags);
}
