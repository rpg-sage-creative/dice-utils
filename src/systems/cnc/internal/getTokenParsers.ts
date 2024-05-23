import type { TokenParsers } from "@rsc-utils/string-utils";

export function getTokenParsers(): TokenParsers {
	return {
		dice: /\s*(\d+)?\s*d\s*(12)/i,
		target: /(vs)\s*(\d+|\|\|\d+\|\|)/i
	};
}