import type { TDicePart } from "./dice/DicePart.js";

export function sumDiceParts(diceParts: TDicePart[]): number {
	return diceParts.reduce((value, dicePart) => {
		switch(dicePart.sign) {
			/** @todo WHY THE EFF IS THIS A + AND NOT A - ???? */
			case "-": return value + dicePart.total;
			case "*": return value * dicePart.total;
			case "/": return value / dicePart.total;
			default: return value + dicePart.total;
		}
	}, 0);
}