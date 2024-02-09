import { createSortedRollData } from "./createSortedRollData.js";
function dicePartRollToString(dicePartRoll, hideRolls) {
    const sortedRollData = createSortedRollData(dicePartRoll, true);
    const outputRollsAndIndexes = dicePartRoll.dice.noSort ? sortedRollData.byIndex : sortedRollData.byRoll;
    const mappedOutuputRolls = outputRollsAndIndexes.map(rollData => rollData.output);
    const output = `[${mappedOutuputRolls.join(", ")}]`;
    return hideRolls ? `||${output}||` : output;
}
export function mapDicePartRollToString(dicePartRoll, dicePartIndex, options) {
    let dicePartRollOutput = "";
    const dice = dicePartRoll.dice;
    const sign = dicePartRoll.sign ?? "+";
    const includeSign = dicePartIndex > 0 || sign !== "+";
    if (includeSign && (dice.hasDie || dice.modifier)) {
        dicePartRollOutput += ` ${dicePartRoll.sign ?? "+"}`;
    }
    if (dice.hasDie) {
        dicePartRollOutput += ` ${dicePartRollToString(dicePartRoll, options.hideRolls)}`;
        if (!options.noDice) {
            const rollemSpacer = options.isRollem ? " " : "";
            dicePartRollOutput += `${rollemSpacer}${dice.count}d${dice.sides}`;
        }
    }
    if (!options.noModifier && dice.modifier) {
        dicePartRollOutput += ` ${Math.abs(dice.modifier)}`;
    }
    if (!options.noDescription) {
        dicePartRollOutput += ` ${dice.description}`;
    }
    if (dice.hasTest) {
        const { alias, value, isHidden } = dice.test;
        dicePartRollOutput += ` ${alias} ${isHidden ? "??" : value}`;
    }
    return dicePartRollOutput.replace(/ +/g, " ").trim();
}
