import { error, getNumberRegex, spoilerRegex, type RegExpCreateOptions, type RegExpGetOptions, type RegExpSpoilerOptions } from "@rsc-utils/core-utils";
import { regex } from "regex";
import { unpipe } from "../../internal/pipes.js";

type CreateOptions = RegExpCreateOptions & RegExpSpoilerOptions;

type GetOptions = RegExpGetOptions & RegExpSpoilerOptions;

/** Creates a new instance of the simple math regex based on options. */
function createSimpleRegex(options?: CreateOptions): RegExp {
	const { gFlag = "", iFlag = "", spoilers } = options ?? {};

	const numberRegex = getNumberRegex({ iFlag, spoilers });

	const simpleRegex = regex(iFlag)`
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

	/** @todo WHY ISN'T THE FIRST ONE THE SAME AS THE SECOND ONE? SEE COMPLEX ... */
	return regex(gFlag + iFlag)`
		(?<!d\d*)         # ignore the entire thing if preceded by d or dY
		${spoileredRegex}
		(?!\d*d\d)        # ignore the entire thing if followed by dY or XdY
	`;
}

/** Stores each unique instance to avoid duplicating regex when not needed. */
const cache: { [key: string]: RegExp; } = { };

/**
 * @internal
 * Returns a cached instance of the simple math regex.
 */
export function getSimpleRegex(options?: GetOptions): RegExp {
	const key = [options?.iFlag ?? "", options?.spoilers ?? ""].join("|");
	return cache[key] ?? (cache[key] = createSimpleRegex(options));
}

/**
 * @internal
 * Tests the value against a simple math regex using the given options.
 */
export function hasSimple(value: string, options?: GetOptions): boolean {
	return getSimpleRegex(options).test(value);
}

/**
 * @internal
 * Replaces all instances of simple math with the resulting calculated value.
 * Valid math symbols: [-+/*%^] and spaces and numbers.
 * Any math resulting in null, undefined, or NaN will have "(NaN)" instead of a numeric result.
 * Any math that throws an error wille have "(ERR)" instead of a numeric result.
 */
export function doSimple(input: string, options?: GetOptions): string {
	// const logQueue = new LogQueue("doSimple", input);
	let output = input;

	// get a cached instance of the regexp for testing
	const tester = getSimpleRegex(options);

	// iterate while we have matches
	while (tester.test(output)) {
		// create a new regex to ensure we have our own lastIndex
		const replacer = createSimpleRegex({ gFlag:"g", iFlag:options?.iFlag, spoilers:options?.spoilers });

		// replace all matches
		output = output.replace(replacer, value => {
			const { hasPipes, unpiped } = unpipe(value);

			// create a return value formatter to ensure consistent output
			const retVal = (result: string) => {
				// logQueue.add({label:"retVal",value,result});
				return hasPipes ? `||${result}||` : result;
			};

			const prepped = unpiped

				// by spacing the -- or ++ characters, the eval can properly process them
				.replace(/\-+|\++/g, s => s.split("").join(" "))

				// replace the caret (math exponent) with ** (code exponent)
				.replace(/\^/g, "**");

			try {


				// do the math
				const outValue = eval(prepped);

				// it is possible to eval to undefined, treat as an error
				if (outValue === null || outValue === undefined || isNaN(outValue)) {
					return retVal(`(NaN)`);
				}

				// if the evaluated number is a negative, it will start with -, allowing math/parsing to continue
				// therefore, we should leave a + if a sign was present before the eval() call and the result is positive
				const outStringValue = String(outValue);
				const signRegex = /^[\-+]/;
				const result = signRegex.test(prepped.trim()) && !signRegex.test(outStringValue)
					? `+${outStringValue}`
					: outStringValue;

				return retVal(result);

			}catch(ex) {
				error(prepped)
				return retVal(`(ERR)`);
			}
		});
		// logQueue.add({label:"while",input,output});
	}
	// logQueue.logDiff(output);
	return output;
}
