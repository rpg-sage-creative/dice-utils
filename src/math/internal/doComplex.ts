import { getNumberRegex, LogQueue, type RegExpCreateOptions, type RegExpGetOptions, type RegExpSpoilerOptions } from "@rsc-utils/core-utils";
import { regex } from "regex";
import { cleanPipes, unpipe } from "../../internal/pipes.js";
import { doSimple, getSimpleRegex } from "./doSimple.js";

type CreateOptions = RegExpCreateOptions & RegExpSpoilerOptions;

type GetOptions = RegExpGetOptions & RegExpSpoilerOptions;

/**
 * Returns a regular expression that finds:
 * min(...number[])
 * max(...number[])
 * floor(number)
 * ceil(number)
 * round(number)
 */
function createComplexRegex(options: CreateOptions = {}): RegExp {
	const { gFlag = "", iFlag = "", spoilers } = options;

	const numberRegex = getNumberRegex({ iFlag, spoilers });

	const simpleRegex = getSimpleRegex({ iFlag, spoilers });

	const numberOrSimple = regex(iFlag)`( ${numberRegex} | ${simpleRegex} )`;

	// try atomic group: (?> ${numberOrSimple} \s* ,? )+
	const functionRegex = regex(iFlag)`
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

	const multiplierRegex = regex(iFlag)`
		(?<multiplier> ${numberRegex} \s* )?
		\(\s*
		(?<simpleMath> ${numberOrSimple} )
		\s*\)
	`;

	const complexRegex = regex(iFlag)`( ${functionRegex} | ${multiplierRegex} )`;

	// const spoileredRegex = spoilerRegex(complexRegex, options);

	return regex(gFlag + iFlag)`
		(?<!\d*d\d+)      # ignore the entire thing if preceded by d or dY
		${complexRegex}
		(?!\d*d\d)        # ignore the entire thing if followed by dY or XdY
	`;
}

/** Stores each unique instance to avoid duplicating regex when not needed. */
const cache: { [key: string]: RegExp; } = { };

/** @internal Returns a cached instance of the complex math regex. */
export function getComplexRegex(options?: GetOptions): RegExp {
	const key = [options?.iFlag ?? "", options?.spoilers ?? ""].join("|");
	return cache[key] ?? (cache[key] = createComplexRegex(options));
}

/** @internal Tests the value against a complex regex using the given options. */
export function hasComplex(value: string, options?: GetOptions): boolean {
	return getComplexRegex(options).test(value);
}

/** @internal Replaces all instances of min/max/floor/ceil/round with the resulting calculated value. */
export function doComplex(input: string, options?: GetOptions): string {
	const logQueue = new LogQueue("doComplex", input);

	let output = input;
	const spoilers = options?.spoilers;

	const complexRegex = createComplexRegex({ gFlag:"g", iFlag:options?.iFlag, spoilers });
	while (complexRegex.test(output)) {
		output = output.replace(complexRegex, (_, _functionName: string | undefined, _functionArgs: string, _multiplier: string | undefined, _simpleMath: string) => {
			if (!spoilers && unpipe(_).hasPipes) return _;

			let hasPipes = false;

			const retVal = (result: string | number) => {
				logQueue.add({label:"retVal",_,result});
				return hasPipes ? `||${result}||` : String(result);
			};

			// handle a math function
			if (_functionName !== undefined) {
				// lower case and cast type
				const functionName = _functionName?.toLowerCase() as "min";
				// check function args for pipes
				const functionArgsPipeInfo = unpipe(_functionArgs);
				// update hasPips for the retVal
				hasPipes = functionArgsPipeInfo.hasPipes;
				// split on space,space and convert to numbers
				const functionArgs = functionArgsPipeInfo.unpiped.split(/\s*,\s*/).map(s => +doSimple(s)!);
				// do the math
				const result = Math[functionName](...functionArgs);
				// return a string
				return retVal(result);
			}

			const simpleMathPipeInfo = unpipe(_simpleMath);

			hasPipes = simpleMathPipeInfo.hasPipes;

			// handle a multiplier
			if (_multiplier !== undefined) {
				// return the new math so that it can be reprocessed
				return retVal(`${_multiplier}*${doSimple(simpleMathPipeInfo.unpiped)}`);
			}

			// handle parentheses
			return retVal(`${doSimple(simpleMathPipeInfo.unpiped)}`);
		});
		logQueue.add({label:"while",input,output});
	}

	// logQueue.logDiff(output);

	return spoilers ? cleanPipes(output) : output;
}