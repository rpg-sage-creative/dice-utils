import { error, getNumberRegex, spoilerRegex } from "@rsc-utils/core-utils";
import { regex } from "regex";
import { unpipe } from "../../internal/pipes.js";
function createSimpleRegex(options) {
    const { gFlag = "", iFlag = "", spoilers } = options ?? {};
    const numberRegex = getNumberRegex({ iFlag, spoilers });
    const simpleRegex = regex(iFlag) `
		(
			${numberRegex}      # pos/neg decimal number
			(                   # open group for operands/numbers
				\s*             # optional whitespace
				[\-+\/*%^]      # operator
				[\-+\s]*        # possible extra pos/neg signs
				${numberRegex}  # pos/neg decimal number
			)+                  # close group for operands/numbers
			|
			([\-+]\s*){2,}      # extra pos/neg signs
			${numberRegex}      # pos/neg decimal number
		)
	`;
    const spoileredRegex = spoilers
        ? spoilerRegex(simpleRegex, spoilers)
        : simpleRegex;
    return regex(gFlag + iFlag) `
		(?<!d\d*)         # ignore the entire thing if preceded by d or dY
		${spoileredRegex}
		(?!\d*d\d)        # ignore the entire thing if followed by dY or XdY
	`;
}
const cache = {};
export function getSimpleRegex(options) {
    const key = [options?.iFlag ?? "", options?.spoilers ?? ""].join("|");
    return cache[key] ?? (cache[key] = createSimpleRegex(options));
}
export function hasSimple(value, options) {
    return getSimpleRegex(options).test(value);
}
export function doSimple(input, options) {
    let output = input;
    const tester = getSimpleRegex(options);
    while (tester.test(output)) {
        const replacer = createSimpleRegex({ gFlag: "g", iFlag: options?.iFlag, spoilers: options?.spoilers });
        output = output.replace(replacer, value => {
            const { hasPipes, unpiped } = unpipe(value);
            const retVal = (result) => {
                return hasPipes ? `||${result}||` : result;
            };
            const prepped = unpiped
                .replace(/\-+|\++/g, s => s.split("").join(" "))
                .replace(/\^/g, "**");
            try {
                const outValue = eval(prepped);
                if (outValue === null || outValue === undefined || isNaN(outValue)) {
                    return retVal(`(NaN)`);
                }
                const outStringValue = String(outValue);
                const signRegex = /^[\-+]/;
                const result = signRegex.test(prepped.trim()) && !signRegex.test(outStringValue)
                    ? `+${outStringValue}`
                    : outStringValue;
                return retVal(result);
            }
            catch (ex) {
                error(prepped);
                return retVal(`(ERR)`);
            }
        });
    }
    return output;
}
