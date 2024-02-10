import { TokenData } from "@rsc-utils/string-utils";
import { DiceGroup, DiceGroupCoreArgs, TDiceGroup } from "../dice/DiceGroup.js";
import { tokensToDicePart } from "./tokensToDicePart.js";
import { TDicePart } from "../dice/DicePart.js";
import { Dice } from "../dice/Dice.js";

function isTestOrTarget(token: TokenData): token is TokenData<"target" | "test"> {
	return ["test", "target"].includes(token.key);
}

function shouldStartNewPart(currentPart: TokenData[], currentToken: TokenData): boolean {
	return !currentPart || ["dice", "mod", "test"].includes(currentToken.key);
}

export function fromTokens(tokens: TokenData[], args: DiceGroupCoreArgs): TDiceGroup {
	let currentPart: TokenData[];
	const partedTokens: TokenData[][] = [];
	tokens.forEach(token => {
		if (shouldStartNewPart(currentPart, token)) {
			currentPart = [];
			partedTokens.push(currentPart);
		}
		currentPart.push(token);
		if (isTestOrTarget(token)) {
			currentPart = [];
			partedTokens.push(currentPart);
		}
	});
	const diceParts = partedTokens.filter(array => array.length).map(tokensToDicePart);

	let currentDice: TDicePart[];
	const partedDice: TDicePart[][] = [];
	diceParts.forEach(dicePart => {
		if (!currentDice
			|| dicePart.hasDie && !dicePart.sign
			|| dicePart.hasTest && currentDice.find(_dicePart => _dicePart.hasTest)) {
			currentDice = [];
			partedDice.push(currentDice);
		}
		currentDice.push(dicePart);
		//TODO: After a test, wee need to start another dicepart ... Or a test becomes its own dicepart
	});
	const _dice = partedDice.map(Dice.create);

	return DiceGroup.create(_dice, args);
}