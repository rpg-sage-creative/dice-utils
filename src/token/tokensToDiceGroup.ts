import type { TokenData } from "@rsc-utils/string-utils";
import type { DiceGroup, DiceGroupCoreArgs, TDiceGroup } from "../dice/DiceGroup.js";
import type { TDicePart } from "../dice/DicePart.js";
import { tokensToDicePart } from "./tokensToDicePart.js";

function isTestOrTarget(token: TokenData): token is TokenData<"target" | "test"> {
	return ["test", "target"].includes(token.key);
}

function shouldStartNewPart(currentPart: TokenData[], currentToken: TokenData): boolean {
	return !currentPart || ["dice", "mod", "test"].includes(currentToken.key);
}

export function tokensToDiceGroup<
			T extends TDiceGroup,
			U extends typeof DiceGroup = typeof DiceGroup,
			V extends DiceGroupCoreArgs = DiceGroupCoreArgs
			>(tokens: TokenData[], dcClass: U, args: V): T {

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

	const diceCores = partedDice.map(dcClass.Child.create);
	return dcClass.create(diceCores, args) as T;
}