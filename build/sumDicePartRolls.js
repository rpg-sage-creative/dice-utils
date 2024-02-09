export function sumDicePartRolls(dicePartRolls) {
    return dicePartRolls.reduce((value, dicePartRoll) => {
        switch (dicePartRoll.sign) {
            case "-": return value + dicePartRoll.total;
            case "*": return value * dicePartRoll.total;
            case "/": return value / dicePartRoll.total;
            default: return value + dicePartRoll.total;
        }
    }, 0);
}
