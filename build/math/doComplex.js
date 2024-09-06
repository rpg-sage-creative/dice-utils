import { LogQueue } from "@rsc-utils/core-utils";
import XRegExp from "xregexp";
import { doSimple, getSimpleRegex } from "./doSimple.js";
import { getNumberRegex } from "./getNumberRegex.js";
export function getComplexRegex(options) {
    const flags = options?.globalFlag ? "xgi" : "xi";
    const numberRegex = getNumberRegex().source;
    const simpleRegex = getSimpleRegex().source;
    const numberOrSimple = `(?:${numberRegex}|${simpleRegex})`;
    return XRegExp(`
		(?<!\\d*d\\d+)                  # ignore the entire thing if preceded by dY or XdY

		(?:                             # open non-capture group for multiplier/function
			(${numberRegex})\\s*        # capture a multiplier, ex: 3(4-2) <-- 3 is the multiplier
			|
			(min|max|floor|ceil|round)  # capture a math function
		)?                              # close non-capture group for multiplier/function; make it optional

		\\(\\s*                         # open parentheses, optional spaces
		(                               # open capture group
			${numberOrSimple}           # first number/simple match
			(?:                         # open non-capture group
				\\s*,\\s*               # comma, optional spaces
				${numberOrSimple}       # additional number/simple matches
			)*                          # close non-capture group, allow any number of them
		)                               # close capture group
		\\s*\\)                         # close parentheses, optional spaces

		(?!\\d*d\\d)                    # ignore the entire thing if followed by dY or XdY
	`, flags);
}
export function hasComplex(value) {
    return getComplexRegex().test(value);
}
export function doComplex(input) {
    const logQueue = new LogQueue("doComplex", input);
    let output = input;
    const regex = getComplexRegex({ globalFlag: true });
    while (regex.test(output)) {
        output = output.replace(regex, (_, _multiplier, _functionName, _args) => {
            const retVal = (result) => { logQueue.add({ label: "retVal", _, result }); return String(result); };
            const args = _args.split(/\s*,\s*/).map(s => +doSimple(s));
            if (_functionName !== undefined) {
                const functionName = _functionName?.toLowerCase();
                const result = Math[functionName](...args);
                return retVal(result);
            }
            if (_multiplier !== undefined) {
                return retVal(`${_multiplier}*${args[0]}`);
            }
            return retVal(`${args[0]}`);
        });
        logQueue.add({ label: "while", input, output });
    }
    return output;
}
