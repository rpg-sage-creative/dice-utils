import XRegExp from "xregexp";
export function getWrappedNumberRegex(options) {
    const WRAPPED_REGEX = XRegExp(`
		\\(\\s*                    # open parentheses, optional spaces
		(                          # open capture group
			[-+]?\\d+(?:\\.\\d+)?  # +- decimal number
		)                          # close capture group
		\\s*\\)                    # close parentheses, optional spaces
		`, "x");
    return options?.globalFlag
        ? new RegExp(WRAPPED_REGEX, "g")
        : WRAPPED_REGEX;
}
export function hasWrappedNumbers(value) {
    return getWrappedNumberRegex().test(value);
}
export function unwrapNumbers(value) {
    const regex = getWrappedNumberRegex({ globalFlag: true });
    return value
        .replace(/(\d+)\(([^()]+)\)/g, "$1*($2)")
        .replace(regex, wrapped => wrapped.slice(1, -1).trim());
}
