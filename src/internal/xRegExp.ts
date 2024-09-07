import XRegExp from "xregexp";

const DEBUG = false;

/** @internal */
export function xRegExp(regex: string, flags: string): RegExp {
	if (DEBUG) {
		return XRegExp(regex, flags);
	}
	const compact = regex
		// remove comments
		.replace(/\#.+\n/g, "")
		// remove whitespace
		.replace(/[\n\t\s]/g, "");
	return new RegExp(compact, flags);
}