import type { TokenData } from "@rsc-utils/string-utils";
import type { DiceGroup, DiceGroupCoreArgs, TDiceGroup } from "../dice/DiceGroup.js";
export declare function tokensToDiceGroup<T extends TDiceGroup, U extends typeof DiceGroup = typeof DiceGroup, V extends DiceGroupCoreArgs = DiceGroupCoreArgs>(tokens: TokenData[], dcClass: U, args: V): T;
