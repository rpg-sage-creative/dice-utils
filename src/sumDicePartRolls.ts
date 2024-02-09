import type { TDicePartRoll } from "./dice/DicePartRoll.js";

export function sumDicePartRolls(dicePartRolls: TDicePartRoll[]): number {
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