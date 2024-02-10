import type { TDicePart } from "./dice/DicePart.js";

export function sumDicePartRolls(dicePartRolls: TDicePart[]): number {
	return dicePartRolls.reduce((value, dicePartRoll) => {
		switch(dicePartRoll.sign) {
			/** @todo WHY THE EFF IS THIS A + AND NOT A - ???? */
			case "-": return value + dicePartRoll.total;
			case "*": return value * dicePartRoll.total;
			case "/": return value / dicePartRoll.total;
			default: return value + dicePartRoll.total;
		}
	}, 0);
}