import { LogQueue } from "@rsc-utils/core-utils";
import { xRegExp } from "../internal/xRegExp.js";
import { getNumberRegex } from "./getNumberRegex.js";
import { unpipe } from "./unpipe.js";
export function getSimpleRegex(options) {
    const flags = options?.globalFlag ? "xgi" : "xi";
    const numberRegex = getNumberRegex({ allowSpoilers: options?.allowSpoilers }).source;
    const simpleRegex = `
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
	`;
    const spoilered = options?.allowSpoilers
        ? `(?:${simpleRegex}|\\|\\|${simpleRegex}\\|\\|)`
        : `(?:${simpleRegex})`;
    return xRegExp(`
		(?<!d\\d*)                # ignore the entire thing if preceded by dY or XdY
		${spoilered}
		(?!\\d*d\\d)              # ignore the entire thing if followed by dY or XdY
	`, flags);
}
export function hasSimple(value, options) {
    return getSimpleRegex(options).test(value);
}
export function doSimple(input, options) {
    const logQueue = new LogQueue("doSimple", input);
    let output = input;
    const regex = getSimpleRegex({ globalFlag: true, allowSpoilers: options?.allowSpoilers });
    while (regex.test(output)) {
        output = output.replace(regex, value => {
            const { hasPipes, unpiped } = unpipe(value);
            const retVal = (result) => {
                logQueue.add({ label: "retVal", value, result });
                return hasPipes ? `||${result}||` : result;
            };
            try {
                const prepped = unpiped
                    .replace(/-+|\++/g, s => s.split("").join(" "))
                    .replace(/\^/g, "**");
                const outValue = eval(prepped);
                if (outValue === null || outValue === undefined || isNaN(outValue)) {
                    return retVal(`(NaN)`);
                }
                const outStringValue = String(outValue);
                const signRegex = /^[+-]/;
                const result = signRegex.test(prepped.trim()) && !signRegex.test(outStringValue)
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
