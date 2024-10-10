import { error, LogQueue } from "@rsc-utils/core-utils";
import { regex } from "regex";
import { unpipe } from "../internal/pipes.js";
import { spoilerRegex } from "../internal/spoilerRegex.js";
import { getNumberRegex } from "./getNumberRegex.js";

type Options = {
	/** include the global flag in the regex */
	gFlag?: "g" | "";

	/** include the case insensitive flag in the regex */
	iFlag?: "i" | "";

	/** are spoilers allowed or optional */
	spoilers?: boolean | "optional";
};

/** Creates a new instance of the simple math regex based on options. */
function createSimpleRegex(options?: Options): RegExp {
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

	const spoileredRegex = spoilerRegex(simpleRegex, options);

	/** @todo WHY ISN'T THE FIRST ONE THE SAME AS THE SECOND ONE? SEE COMPLEX ... */
	return regex(gFlag + iFlag)`
		(?<!d\d*)         # ignore the entire thing if preceded by d or dY
		${spoileredRegex}
		(?!\d*d\d)        # ignore the entire thing if followed by dY or XdY
	`;
}

/** Stores each unique instance to avoid duplicating regex when not needed. */
const cache: { [key: string]: RegExp; } = { };

/** Creates the unique key for each variant based on options. */
function createCacheKey(options?: Options): string {
	return [options?.gFlag ?? false, options?.iFlag ?? false, options?.spoilers ?? false].join("|");
}

/** Returns a cached instance of the simple math regex. */
export function getSimpleRegex(options?: Options): RegExp {
	const key = createCacheKey(options);
	return cache[key] ?? (cache[key] = createSimpleRegex(options));
}

/** Tests the value against a simple math regex using the given options. */
export function hasSimple(value: string, options?: Omit<Options, "gFlag">): boolean {
	return getSimpleRegex({ iFlag:options?.iFlag, spoilers:options?.spoilers }).test(value);
}

/**
 * Replaces all instances of simple math with the resulting calculated value.
 * Valid math symbols: [-+/*%^] and spaces and numbers.
 * Any math resulting in null, undefined, or NaN will have "(NaN)" instead of a numeric result.
 * Any math that throws an error wille have "(ERR)" instead of a numeric result.
 */
export function doSimple(input: string, options?: Omit<Options, "gFlag">): string {
	const logQueue = new LogQueue("doSimple", input);
	let output = input;
	const simpleRegex = getSimpleRegex({ gFlag:"g", iFlag:options?.iFlag, spoilers:options?.spoilers });
	while (simpleRegex.test(output)) {
		output = output.replace(simpleRegex, value => {
			const { hasPipes, unpiped } = unpipe(value);

			const retVal = (result: string) => {
				logQueue.add({label:"retVal",value,result});
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
		logQueue.add({label:"while",input,output});
	}
	// logQueue.logDiff(output);
	return output;
}
