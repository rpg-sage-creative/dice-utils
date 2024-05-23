import type { TokenData } from "@rsc-utils/string-utils";
import type { DicePartCore } from "../../../../dice/DicePart.js";
import { parseDiceTestTargetValue } from "../../../../DiceTest.js";
import { TargetType } from "./TargetType.js";

export function reduceTokenToDicePartCore<T extends DicePartCore>(core: T, token: TokenData): T {
	if (token.key === "dice") {
		core.count = 1;
		core.sides = 20;
	}else if (token.key === "target") {
		const { value, hidden } = parseDiceTestTargetValue(token.matches[1]);
		core.target = { type:TargetType.VS, value, hidden };
	}else {
		core.description = (core.description ?? "") + token.token;
	}
	return core;
}