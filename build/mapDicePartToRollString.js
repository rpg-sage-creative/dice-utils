function dicePartToRollString(dicePart, hideRolls) {
    const sortedRollData = dicePart.sortedRollData;
    if (sortedRollData) {
        const outputRollsAndIndexes = sortedRollData.noSort ? sortedRollData.byIndex : sortedRollData.byValue;
        const mappedOutuputRolls = outputRollsAndIndexes.map(rollData => rollData.text);
        const output = `[${mappedOutuputRolls.join(", ")}]`;
        return hideRolls ? `||${output}||` : output;
    }
    return "";
}
export function mapDicePartToRollString(dicePart, dicePartIndex, options) {
    let dicePartRollOutput = "";
    const sign = dicePart.sign ?? "+";
    const includeSign = dicePartIndex > 0 || sign !== "+";
    if (includeSign && (dicePart.hasDie || dicePart.modifier)) {
        dicePartRollOutput += ` ${dicePart.sign ?? "+"}`;
    }
    if (dicePart.hasDie) {
        dicePartRollOutput += ` ${dicePartToRollString(dicePart, options.hideRolls)}`;
        if (!options.noDice) {
            const rollemSpacer = options.isRollem ? " " : "";
            dicePartRollOutput += `${rollemSpacer}${dicePart.count}d${dicePart.sides}`;
        }
    }
    if (!options.noModifier && dicePart.modifier) {
        dicePartRollOutput += ` ${Math.abs(dicePart.modifier)}`;
    }
    if (!options.noDescription) {
        dicePartRollOutput += ` ${dicePart.description}`;
    }
    if (dicePart.hasTest) {
        const { alias, value, isHidden } = dicePart.test;
        dicePartRollOutput += ` ${alias} ${isHidden ? "??" : value}`;
    }
    return dicePartRollOutput.replace(/ +/g, " ").trim();
}
