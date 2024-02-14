function isTestOrTarget(token) {
    return ["test", "target"].includes(token.key);
}
function shouldStartNewPart(currentPart, currentToken) {
    return !currentPart || ["dice", "mod", "test"].includes(currentToken.key);
}
export function partitionDicePartTokens(tokens) {
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
    return partedTokens.filter(array => array.length);
}
