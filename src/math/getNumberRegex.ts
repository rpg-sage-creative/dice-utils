import { regex } from "regex";
import { spoilerRegex } from "../internal/spoilerRegex.js";

type Options = {
	/** require the value to be "anchored" to start/end of the string */
	anchored?: boolean;

	/** capture the number, optionally with a capture group */
	capture?: string;

	/** include the global flag in the regex */
	gFlag?: "g" | "";

	/** include the case insensitive flag in the regex */
	iFlag?: "i" | "";

	/** are spoilers allowed or optional */
	spoilers?: boolean | "optional";
};

/** Creates a new instance of the number regex based on options. */
function createNumberRegex(options?: Options): RegExp {
	const { anchored, capture, gFlag = "", iFlag = "" } = options ?? {};

	const numberRegex = regex(iFlag)`
		[\-+]?    # optional pos/neg sign
		\d+       # integer portion
		(\.\d+)?  # optional decimal portion
	`;

	const spoileredRegex = spoilerRegex(numberRegex, options);

	if (anchored) {
		if (capture) {
			return regex(gFlag + iFlag)`^ (?<${capture}> ${spoileredRegex}) $`;
		}
		return regex(gFlag + iFlag)`^ ${spoileredRegex} $`;
	}

	if (capture) {
		return regex(gFlag + iFlag)`(?<${capture}> ${spoileredRegex})`;
	}
	return regex(gFlag + iFlag)`${spoileredRegex}`;
}

/** Stores each unique instance to avoid duplicating regex when not needed. */
const cache: { [key: string]: RegExp; } = { };

/**
 * Returns an instance of the number regexp.
 * If gFlag is passed, a new regexp is created.
 * If gFlag is not passed, a cached version of the regexp is used.
 */
export function getNumberRegex(options?: Options): RegExp {
	if (options?.gFlag) return createNumberRegex(options);
	const key = [options?.anchored ?? "", options?.capture ?? "", options?.gFlag ?? "", options?.iFlag ?? "", options?.spoilers ?? ""].join("|");
	return cache[key] ?? (cache[key] = createNumberRegex(options));
}