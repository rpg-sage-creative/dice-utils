import { regex } from "regex";

type Options = {
	/** include the case insensitive flag in the regex */
	iFlag?: "i" | "";

	/** are spoilers allowed or optional */
	spoilers?: boolean | "optional";
};

/** @internal Properly wraps regex in spoilers if needed. */
export function spoilerRegex(regexp: RegExp, options?: Options) {
	const { iFlag = "", spoilers } = options ?? {};
	if (spoilers) {
		// use interpolated string literal "||" to properly escape them
		const pipedRegex = regex(iFlag)`${"||"} ${regexp} ${"||"}`;
		return spoilers === "optional"
			? regex(iFlag)`( ${pipedRegex} | ${regexp} )`
			: pipedRegex;
	}
	return regexp;
}