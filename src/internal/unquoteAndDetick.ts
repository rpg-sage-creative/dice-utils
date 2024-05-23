import XRegExp from "xregexp";

/**
 * @internal
 * Removes quotes from around the value.
 * Removes all backticks (`) from remaining value.
 */
export function unquoteAndDetick(value: string): string {
	const quoteRegex = XRegExp(`
		^(
			“[^”]*”
			|
			„[^“]*“
			|
			„[^”]*”
			|
			"[^"]*"
			|
			[“”"][^“”"]*[“”"]
			|
			'[^']*'
			|
			‘[^’]*’
		)$
	`, "xi");
	if (quoteRegex.test(value)) {
		value = value.slice(1, -1);
	}
	return value.replace(/`/g, "");
}