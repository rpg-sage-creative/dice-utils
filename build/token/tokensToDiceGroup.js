import { tokensToDicePart } from "./tokensToDicePart.js";
function isTestOrTarget(token) {
    return ["test", "target"].includes(token.key);
}
function shouldStartNewPart(currentPart, currentToken) {
    return !currentPart || ["dice", "mod", "test"].includes(currentToken.key);
}
export function tokensToDiceGroup(tokens, dcClass, args) {
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
    const diceCores = partedDice.map(dcClass.Child.create);
    return dcClass.create(diceCores, args);
}
