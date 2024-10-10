import { regex } from "regex";
export function unquote(value) {
    const quoteRegex = regex `
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
	`;
    return quoteRegex.test(value)
        ? value.slice(1, -1)
        : value;
}
