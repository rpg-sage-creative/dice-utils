import { doStatMath } from "./doStatMath.js";
import type { ProcessStatsArgs } from "./processStats.js";
import type { StatsCharacter } from "./types.js";

type ReplaceStatsArgs = ProcessStatsArgs & {
	statRegex: RegExp;
	typeRegex: RegExp;
};

export function replaceStats(diceString: string, args: ReplaceStatsArgs, stack: string[] = []): string {
	let replaced = diceString;
	while (args.statRegex.test(replaced)) {
		replaced = replaced.replace(new RegExp(args.statRegex, "gi"), match => {
			const [_, name, stat, defaultValue] = args.statRegex.exec(match) ?? [];

			// check stack for recursion
			const stackValue = `${name}::${stat}`.toLowerCase();
			if (stack.includes(stackValue)) {
				return `\`${match}\``;
			}

			// get character
			let char: StatsCharacter | null = null;
			if (name) {
				const [_, isPc, isAlt] = args.typeRegex.exec(name) ?? [];
				if (isPc) {
					char = args.pc ?? null;
				}else if (isAlt) {
					char = args.pc?.companions[0] ?? null;
				}else {
					char = args.pcs.findByName(name)
						?? args.pcs.findCompanion(name)
						?? args.npcs.findByName(name)
						?? args.npcs.findCompanion(name)
						?? args.encounters?.findActiveChar(name)
						?? null;
				}
			}else {
				char = args.pc ?? null;
			}

			// get stat
			const statVal = char?.getStat(stat);
			const statValue = statVal ?? defaultValue?.trim() ?? "";
			if (statValue.length) {
				// check for nested stat block
				if (args.statRegex.test(statValue)) {
					return replaceStats(statValue, args, stack.concat([stackValue]));
				}
				return statValue;
			}

			// return escaped match
			return `\`${match}\``;
		});
		// ensure any math is handled
		return doStatMath(replaced);
	}
	// return updated value
	return replaced;
}