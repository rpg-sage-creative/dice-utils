import { createSortedRollData } from "./createSortedRollData.js";
import { TDicePartRoll } from "./dice/DicePartRoll.js";

type MapDicePartRollOptions = {
	hideRolls: boolean;
	isRollem?: boolean;
	noDescription?: boolean;
	noDice?: boolean;
	noModifier?: boolean;
};

function dicePartRollToString(dicePartRoll: TDicePartRoll, hideRolls?: boolean): string {
	const sortedRollData = createSortedRollData(dicePartRoll, true);
	const outputRollsAndIndexes = dicePartRoll.dice.noSort ? sortedRollData.byIndex : sortedRollData.byRoll;
	const mappedOutuputRolls = outputRollsAndIndexes.map(rollData => rollData.output);
	const output = `[${mappedOutuputRolls.join(", ")}]`;
	return hideRolls ? `||${output}||` : output;
}

export function mapDicePartRollToString(dicePartRoll: TDicePartRoll, dicePartIndex: number, options: MapDicePartRollOptions): string {
	let dicePartRollOutput = "";
	const dice = dicePartRoll.dice;

	// leading sign
	const sign = dicePartRoll.sign ?? "+";
	const includeSign = dicePartIndex > 0 || sign !== "+";
	if (includeSign && (dice.hasDie || dice.modifier)) {
		dicePartRollOutput += ` ${dicePartRoll.sign ?? "+"}`;
	}

	// dice
	if (dice.hasDie) {
		dicePartRollOutput += ` ${dicePartRollToString(dicePartRoll, options.hideRolls)}`;
		if (!options.noDice) {
			const rollemSpacer = options.isRollem ? " " : "";
			dicePartRollOutput += `${rollemSpacer}${dice.count}d${dice.sides}`;
		}
	}

	// modifier
	if (!options.noModifier && dice.modifier) {
		dicePartRollOutput += ` ${Math.abs(dice.modifier)}`;
	}

	// description
	if (!options.noDescription) {
		dicePartRollOutput += ` ${dice.description}`;
	}

	// test
	if (dice.hasTest) {
		const { alias, value, isHidden } = dice.test;
		dicePartRollOutput += ` ${alias} ${isHidden ? "??" : value}`;
	}

	//cleanup
	return dicePartRollOutput.replace(/ +/g, " ").trim();
}