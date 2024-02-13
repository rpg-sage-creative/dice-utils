import type { TokenData } from "@rsc-utils/string-utils";
import type { DicePartCore } from "../dice/DicePart.js";
import { DiceDropKeep } from "./DiceDropKeep.js";
import { DiceExplode } from "./DiceExplode.js";
import { DiceThreshold } from "./DiceThreshold.js";

type DiceManipulation = { isEmpty:boolean; };
function notEmpty<T extends DiceManipulation>(dm: T): T | undefined {
	return dm.isEmpty ? undefined : dm;
}

export function appendManipulationToCore(core: DicePartCore, token: TokenData, index: number, tokens: TokenData[]): boolean {
	const lastToken = tokens[index - 1];
	if (["dice", "dropKeep", "explode", "noSort", "threshold"].includes(lastToken?.key)) {
		const dropKeep = DiceDropKeep.from(token);
		const explode = DiceExplode.from(token);
		const noSort = token.key === "noSort"; // if we want to be strict about not duping "ns": && !core.manipulation?.find(m => m.noSort);
		const threshold = DiceThreshold.from(token);
		if (!dropKeep.isEmpty || !explode.isEmpty || noSort || !threshold.isEmpty) {
			const manipulation = core.manipulation ?? (core.manipulation = []);
			manipulation.push({
				dropKeep: notEmpty(dropKeep),
				explode: notEmpty(explode),
				noSort: noSort ? true : undefined,
				threshold: notEmpty(threshold)
			});
			return true;
		}
	}
	return false;
}