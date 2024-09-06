import { LogQueue } from "@rsc-utils/core-utils";
import XRegExp from "xregexp";
import { getNumberRegex } from "./getNumberRegex.js";
export function getSimpleRegex(options) {
    const flags = options?.globalFlag ? "xgi" : "xi";
    const numberRegex = getNumberRegex().source;
    return XRegExp(`
		(?<!d\\d*)                # ignore the entire thing if preceded by dY or XdY

		(?:
			${numberRegex}        # pos/neg decimal number
			(?:                   # open group for operands/numbers
				\\s*              # optional whitespace
				[-+/*%^]          # operator
				[-+\\s]*          # possible extra pos/neg signs
				${numberRegex}    # pos/neg decimal number
			)+                    # close group for operands/numbers
			|
			(?:[-+]\\s*){2,}      # extra pos/neg signs
			${numberRegex}        # pos/neg decimal number
		)

		(?!\\d*d\\d)              # ignore the entire thing if followed by dY or XdY
		`, flags);
}
export function hasSimple(value) {
    return getSimpleRegex().test(value);
}
export function doSimple(input) {
    const logQueue = new LogQueue("doSimple", input);
    let output = input;
    const regex = getSimpleRegex({ globalFlag: true });
    while (regex.test(output)) {
        output = output.replace(regex, value => {
            const retVal = (result) => { logQueue.add({ label: "retVal", value, result }); return result; };
            try {
                value = value.replace(/-+|\++/g, s => s.split("").join(" "));
                value = value.replace(/\^/g, "**");
                const outValue = eval(value);
                if (outValue === null || outValue === undefined || isNaN(outValue)) {
                    return retVal(`(NaN)`);
                }
                const outStringValue = String(outValue).trim();
                const signRegex = /^[+-]/;
                const result = signRegex.test(value.trim()) && !signRegex.test(outStringValue)
                    ? `+${outStringValue}`
                    : outStringValue;
                return retVal(result);
            }
            catch (ex) {
                return retVal(`(ERR)`);
            }
        });
        logQueue.add({ label: "while", input, output });
    }
    return output;
}
