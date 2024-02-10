import type { TokenData } from "@rsc-utils/string-utils";
import { DicePart, type DicePartCore, type TDicePart } from "../dice/DicePart.js";
import { reduceTokenToDicePartCore } from "./reduceTokenToDicePartCore.js";

export function tokensToDicePart(tokens: TokenData[]): TDicePart {
	const core = tokens.reduce(reduceTokenToDicePartCore, { description:"" } as DicePartCore);
	return DicePart.create(core);
}