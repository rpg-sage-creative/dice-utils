import type { TokenParsers } from "@rsc-utils/string-utils";

export function getTokenParsers(): TokenParsers {
	return {
		dice: /\s*(1)?\s*d\s*(20)/i,
		target: /(vs)\s*(\d+|\|\|\d+\|\|)/i
	};
}