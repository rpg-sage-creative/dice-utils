import { DiceGroup } from "../dice/DiceGroup.js";
import { tokensToDicePart } from "./tokensToDicePart.js";
import { Dice } from "../dice/Dice.js";
function isTestOrTarget(token) {
    return ["test", "target"].includes(token.key);
}
function shouldStartNewPart(currentPart, currentToken) {
    return !currentPart || ["dice", "mod", "test"].includes(currentToken.key);
}
export function fromTokens(tokens, args) {
    let currentPart;
    const partedTokens = [];
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
    let currentDice;
    const partedDice = [];
    diceParts.forEach(dicePart => {
        if (!currentDice
            || dicePart.hasDie && !dicePart.sign
            || dicePart.hasTest && currentDice.find(_dicePart => _dicePart.hasTest)) {
            currentDice = [];
            partedDice.push(currentDice);
        }
        currentDice.push(dicePart);
    });
    const _dice = partedDice.map(Dice.create);
    return DiceGroup.create(_dice, args);
}
