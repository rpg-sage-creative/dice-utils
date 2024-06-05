import XRegExp from "xregexp";
export function unquote(value) {
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
    return quoteRegex.test(value)
        ? value.slice(1, -1)
        : value;
}
