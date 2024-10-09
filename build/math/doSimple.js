import { error, LogQueue } from "@rsc-utils/core-utils";
import { regex } from "regex";
import { unpipe } from "../internal/pipes.js";
import { spoilerRegex } from "../internal/spoilerRegex.js";
import { getNumberRegex } from "./getNumberRegex.js";
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
    const spoileredRegex = spoilerRegex(simpleRegex, options);
    return regex(gFlag + iFlag) `
		(?<!d\d*)         # ignore the entire thing if preceded by d or dY
		${spoileredRegex}
		(?!\d*d\d)        # ignore the entire thing if followed by dY or XdY
	`;
}
const cache = {};
function createCacheKey(options) {
    return [options?.gFlag ?? false, options?.iFlag ?? false, options?.spoilers ?? false].join("|");
}
export function getSimpleRegex(options) {
    const key = createCacheKey(options);
    return cache[key] ?? (cache[key] = createSimpleRegex(options));
}
export function hasSimple(value, options) {
    return getSimpleRegex({ iFlag: options?.iFlag, spoilers: options?.spoilers }).test(value);
}
export function doSimple(input, options) {
    const logQueue = new LogQueue("doSimple", input);
    let output = input;
    const simpleRegex = getSimpleRegex({ gFlag: "g", iFlag: options?.iFlag, spoilers: options?.spoilers });
    while (simpleRegex.test(output)) {
        output = output.replace(simpleRegex, value => {
            const { hasPipes, unpiped } = unpipe(value);
            const retVal = (result) => {
                logQueue.add({ label: "retVal", value, result });
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
        logQueue.add({ label: "while", input, output });
    }
    return output;
}
