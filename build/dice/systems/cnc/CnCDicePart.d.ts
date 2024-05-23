import { GameSystemType } from "../../../types/GameSystemType.js";
import { DicePart, type DicePartCore, type DicePartCoreArgs, type TDicePart } from "../../DicePart.js";
import { reduceTokenToCnCDicePartCore } from "./internal/reduceTokenToCnCDicePartCore.js";
import { targetDataToCnCTestData } from "./internal/targetDataToCnCTestData.js";
import type { TargetType } from "./internal/TargetType.js";
export declare class CnCDicePart extends DicePart<DicePartCore<TargetType>, TargetType, GameSystemType> {
    static create<DicePartType extends TDicePart>({ count, description, target }?: DicePartCoreArgs): DicePartType;
    static readonly reduceTokenToCore: typeof reduceTokenToCnCDicePartCore;
    static readonly targetDataToTestData: typeof targetDataToCnCTestData;
    static readonly GameType = GameSystemType.CnC;
}
