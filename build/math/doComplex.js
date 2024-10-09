import { LogQueue } from "@rsc-utils/core-utils";
import { regex } from "regex";
import { cleanPipes, unpipe } from "../internal/pipes.js";
import { doSimple, getSimpleRegex } from "./doSimple.js";
import { getNumberRegex } from "./getNumberRegex.js";
function createComplexRegex(options = {}) {
    const { gFlag = "", iFlag = "", spoilers } = options ?? {};
    const numberRegex = getNumberRegex({ iFlag, spoilers });
    const simpleRegex = getSimpleRegex({ iFlag, spoilers });
    const numberOrSimple = regex(iFlag) `( ${numberRegex} | ${simpleRegex} )`;
    const functionRegex = regex(iFlag) `
		(?<functionName> min | max | floor | ceil | round )
		\s*\(\s*
		(?<functionArgs>
			${numberOrSimple}           # first number/simple match
			(                           # open non-capture group
				\s*,\s*                 # comma, optional spaces
				${numberOrSimple}       # additional number/simple matches
			)*                          # close non-capture group, allow any number of them
		)
		\s*\)
	`;
    const multiplierRegex = regex(iFlag) `
		(?<multiplier> ${numberRegex} \s* )?
		\(\s*
		(?<simpleMath> ${numberOrSimple} )
		\s*\)
	`;
    const complexRegex = regex(iFlag) `( ${functionRegex} | ${multiplierRegex} )`;
    return regex(gFlag + iFlag) `
		(?<!\d*d\d+)         # ignore the entire thing if preceded by d or dY
		${complexRegex}
		(?!\d*d\d)        # ignore the entire thing if followed by dY or XdY
	`;
}
const cache = {};
function createCacheKey(options) {
    return [options?.gFlag ?? false, options?.iFlag ?? false, options?.spoilers ?? false].join("|");
}
export function getComplexRegex(options) {
    const key = createCacheKey(options);
    return cache[key] ?? (cache[key] = createComplexRegex(options));
}
export function hasComplex(value, options) {
    return getComplexRegex({ iFlag: options?.iFlag, spoilers: options?.spoilers }).test(value);
}
export function doComplex(input, options) {
    const logQueue = new LogQueue("doComplex", input);
    let output = input;
    const complexRegex = getComplexRegex({ gFlag: "g", iFlag: options?.iFlag, spoilers: options?.spoilers });
    while (complexRegex.test(output)) {
        output = output.replace(complexRegex, (_, _functionName, _functionArgs, _multiplier, _simpleMath) => {
            let hasPipes = false;
            const retVal = (result) => {
                logQueue.add({ label: "retVal", _, result });
                return hasPipes ? `||${result}||` : String(result);
            };
            if (_functionName !== undefined) {
                const functionName = _functionName?.toLowerCase();
                const functionArgsPipeInfo = unpipe(_functionArgs);
                hasPipes = functionArgsPipeInfo.hasPipes;
                const functionArgs = functionArgsPipeInfo.unpiped.split(/\s*,\s*/).map(s => +doSimple(s));
                const result = Math[functionName](...functionArgs);
                return retVal(result);
            }
            const simpleMathPipeInfo = unpipe(_simpleMath);
            hasPipes = simpleMathPipeInfo.hasPipes;
            if (_multiplier !== undefined) {
                return retVal(`${_multiplier}*${doSimple(simpleMathPipeInfo.unpiped)}`);
            }
            return retVal(`${doSimple(simpleMathPipeInfo.unpiped)}`);
        });
        logQueue.add({ label: "while", input, output });
    }
    return cleanPipes(output);
}
