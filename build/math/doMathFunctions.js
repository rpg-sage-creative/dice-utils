import XRegExp from "xregexp";
import { doSimple, getSimpleRegex } from "./doSimple.js";
import { getNumberRegex } from "./getNumberRegex.js";
export function getMathFunctionRegex(options) {
    const numberRegex = getNumberRegex({ capture: true }).source;
    const simpleRegex = getSimpleRegex().source;
    const MIN_MAX_REGEX = XRegExp(`
		(?:
			${numberRegex}\\s*
			|
			(min|max|floor|ceil|round)
		)?
		\\(\\s*                      # open parentheses, optional spaces
		(                            # open capture group
			${simpleRegex}           # first simple match
			(?:                      # open non-capture group
				\\s*,\\s*            # comma, optional spaces
				${simpleRegex}       # additional simple match
			)*                       # close non-capture group, allow any number of them
		)                            # close capture group
		\\s*\\)                      # close parentheses, optional spaces
		`, "xi");
    return options?.globalFlag
        ? new RegExp(MIN_MAX_REGEX, "gi")
        : MIN_MAX_REGEX;
}
export function hasMathFunctions(value) {
    return getMathFunctionRegex().test(value);
}
export function doMathFunctions(value) {
    const regex = getMathFunctionRegex({ globalFlag: true });
    while (regex.test(value)) {
        value = value.replace(regex, (_, _multiplier, _functionName, _args) => {
            const args = _args.split(/\s*,\s*/).map(s => +doSimple(s));
            if (_functionName !== undefined) {
                const functionName = _functionName?.toLowerCase();
                const result = Math[functionName](...args);
                return String(result);
            }
            if (_multiplier !== undefined) {
                return `${_multiplier}*${args[0]}`;
            }
            return `${args[0]}`;
        });
    }
    return value;
}
