import type { TokenData } from "@rsc-utils/string-utils";
import type { TDiceBaseCore } from "../dice/DiceBase.js";
import type { DicePartCore } from "../dice/DicePart.js";
import { type DiceDropKeepType } from "../manipulate/DiceDropKeep.js";
import type { DiceOperator } from "../types/DiceOperator.js";
export type ReduceSignToDropKeep = {
    sign: DiceOperator;
    type: DiceDropKeepType;
    value: number;
    alias: string;
    test: (core: DicePartCore, token: TokenData) => boolean;
};
export type reduceTokenToCore<T extends TDiceBaseCore> = (core: T, token: TokenData, index: number, tokens: TokenData[], reduceSignToDropKeepData?: ReduceSignToDropKeep[]) => T;
export declare function reduceTokenToDicePartCore<T extends DicePartCore>(core: T, token: TokenData, index: number, tokens: TokenData[], reduceSignToDropKeepData?: ReduceSignToDropKeep[]): T;
