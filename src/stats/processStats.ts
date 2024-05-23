import XRegExp from "xregexp";
import { replaceStats } from "./replaceStats.js";
import type { StatsCharacter, StatsCharacterManager, StatsEncounterManager } from "./types.js";

export type ProcessStatsArgs = {
	encounters?: StatsEncounterManager;
	npcs: StatsCharacterManager;
	pcs: StatsCharacterManager;
	pc?: StatsCharacter | null;
};

function getStatRegex() {
	return XRegExp(`
		# no tick
		(?<!\`)

		\\{
			# char name or quoted char name
			(
				[\\w ]+    # <-- should we drop this space?
				|          # <-- in other places we allow alias (no spaces) or "quoted name with spaces"
				"[\\w ]+"
			)

			# separator
			:{2}

			# stat key
			(
				[^:{}]+
			)

			# default value
			(?:
				:
				([^{}]+)
			)?
		\\}

		# no tick
		(?!\`)
	`, "xi");
}

function getCharTypeRegex() {
	return XRegExp(`
		^
		(pc|stat)?
		(companion|hireling|alt|familiar)?
		$
	`, "xi");
}

export function processStats(diceString: string, args: ProcessStatsArgs) {
	const statRegex = getStatRegex();
	if (statRegex.test(diceString)) {
		const typeRegex = getCharTypeRegex();
		diceString = replaceStats(diceString, { statRegex, typeRegex, ...args });
	}
	return diceString;
}