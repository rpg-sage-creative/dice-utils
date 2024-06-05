import XRegExp from "xregexp";
export function getMinMaxRegex(options) {
    const MIN_MAX_REGEX = XRegExp(`
		(min|max)                      # function name
		\\(\\s*                        # open parentheses, optional spaces
		(                              # open capture group
			[-+]?\\d+(?:\\.\\d+)?      # first +- decimal number
			(?:                        # open non-capture group
				\\s*,\\s*              # comma, optional spaces
				[-+]?\\d+(?:\\.\\d+)?  # additional +- decimal number
			)*                         # close non-capture group, allow any number of them
		)                              # close capture group
		\\s*\\)                        # close parentheses, optional spaces
		`, "xi");
    return options?.globalFlag
        ? new RegExp(MIN_MAX_REGEX, "gi")
        : MIN_MAX_REGEX;
}
export function hasMinMax(value) {
    return getMinMaxRegex().test(value);
}
export function doMinMax(value) {
    const regex = getMinMaxRegex({ globalFlag: true });
    while (regex.test(value)) {
        value = value.replace(regex, (_, _minMax, _args) => {
            const minMax = _minMax.toLowerCase();
            const args = _args.split(/\s*,\s*/).map(s => +s);
            const result = Math[minMax](...args);
            return String(result);
        });
    }
    return value;
}
