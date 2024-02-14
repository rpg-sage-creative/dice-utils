export function partitionDiceParts(diceParts) {
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
    return partedDice.filter(array => array.length);
}
