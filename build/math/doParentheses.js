import XRegExp from "xregexp";
import { doSimple } from "./doSimple.js";
export function getParenthesesRegex(options) {
    const PAREN_REGEX = XRegExp(`
		\\(         # open parentheses
		[^()]*      # optional non-parentheses
		[^\\d.()]   # we need a non-number/decimal *and* non-parentheses
		[^()]*      # optional non-parentheses
		\\)         # close parentheses
		`, "x");
    return options?.globalFlag
        ? new RegExp(PAREN_REGEX, "gi")
        : PAREN_REGEX;
}
export function hasParentheses(value) {
    return getParenthesesRegex().test(value);
}
export function doParentheses(value) {
    const regex = getParenthesesRegex({ globalFlag: true });
    return value.replace(regex, match => {
        const sliced = match.slice(1, -1);
        const result = doSimple(sliced);
        return `(${result ?? 0})`;
    });
}
