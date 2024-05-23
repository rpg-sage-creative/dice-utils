import XRegExp from "xregexp";
export function unquoteAndDetick(value) {
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
