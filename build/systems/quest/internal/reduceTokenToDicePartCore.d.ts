import type { TokenData } from "@rsc-utils/string-utils";
import type { DicePartCore } from "../../../dice/DicePart.js";
export declare function reduceTokenToDicePartCore<T extends DicePartCore>(core: T, token: TokenData): T;
