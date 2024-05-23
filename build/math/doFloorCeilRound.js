import XRegExp from "xregexp";
export function getFloorCeilRoundRegex(options) {
    const FLOOR_CEIL_REGEX = XRegExp(`
		(floor|ceil|round)         # function name
		\\(\\s*                    # open parentheses, optional spaces
		(                          # open capture group
			[-+]?\\d+(?:\\.\\d+)?  # +- decimal number
		)                          # close capture group
		\\s*\\)                    # close parentheses, optional spaces
	`, "xi");
    return options?.globalFlag
        ? new RegExp(FLOOR_CEIL_REGEX, "gi")
        : FLOOR_CEIL_REGEX;
}
export function hasFloorCeilRound(value) {
    return getFloorCeilRoundRegex().test(value);
}
export function doFloorCeilRound(value) {
    const regex = getFloorCeilRoundRegex({ globalFlag: true });
    while (regex.test(value)) {
        value = value.replace(regex, (_, _func, _value) => {
            const func = _func.toLowerCase();
            const value = +_value;
            const result = Math[func](value);
            return String(result);
        });
    }
    return value;
}
