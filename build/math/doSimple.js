import {} from "@rsc-utils/core-utils";
import XRegExp from "xregexp";
import { getNumberRegex } from "./getNumberRegex.js";
export function getSimpleRegex(options) {
    const numberRegex = getNumberRegex().source;
    const signsRegex = `[-+\\s]*`;
    const SIMPLE_REGEX = XRegExp(`
		${options?.anchored ? "^" : ""}
		${signsRegex}         # possible extra add/subtract signs
		${numberRegex}        # pos/neg decimal number
		(?:                   # open group for operands/numbers
			\\s*              # optional whitespace
			[-+/*%^]          # operator
			${signsRegex}     # possible extra add/subtract signs
			${numberRegex}    # pos/neg decimal number
		)*                    # close group for operands/numbers
		${options?.anchored ? "$" : ""}
		`, "x");
    return SIMPLE_REGEX;
}
export function isSimple(value) {
    return doSimple(value) !== undefined;
}
export function doSimple(value) {
    try {
        if (getSimpleRegex({ anchored: true }).test(value.trim())) {
            value = value.replace(/(-|\+)+/g, s => s.split("").join(" "));
            value = value.replace(/\^/g, "**");
            const outValue = eval(value);
            if (outValue === null || outValue === undefined || isNaN(outValue)) {
                return null;
            }
            const outStringValue = String(outValue).trim();
            const signRegex = /^[+-]/;
            return signRegex.test(value.trim()) && !signRegex.test(outStringValue)
                ? `+${outStringValue}`
                : outStringValue;
        }
    }
    catch (ex) {
        return null;
    }
    return undefined;
}
