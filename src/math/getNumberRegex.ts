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

	const captureKey = capture ? `?<${capture}>` : ``;

	const numberRegex = regex(iFlag)`
		[\-+]?    # optional pos/neg sign
		\d+       # integer portion
		(\.\d+)?  # optional decimal portion
	`;

	const spoileredRegex = spoilerRegex(numberRegex, options);

	if (anchored) {
		return regex(gFlag + iFlag)`^ (${captureKey} ${spoileredRegex}) $`;
	}

	return regex(gFlag + iFlag)`(${captureKey} ${spoileredRegex})`;
}

/** Stores each unique instance to avoid duplicating regex when not needed. */
const cache: { [key: string]: RegExp; } = { };

/** Creates the unique key for each variant based on options. */
function createCacheKey(options?: Options): string {
	return [options?.anchored ?? false, options?.capture ?? "", options?.gFlag ?? false, options?.iFlag ?? false, options?.spoilers ?? false].join("|");
}

/** Returns a cached instance of the number regex. */
export function getNumberRegex(options?: Options): RegExp {
	const key = createCacheKey(options);
	return cache[key] ?? (cache[key] = createNumberRegex(options));
}