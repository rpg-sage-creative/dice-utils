import { DicePart, type DicePartCore, type DicePartCoreArgs, type TDicePart } from "../../dice/DicePart.js";
import { GameSystemType } from "../../types/GameSystemType.js";
import type { TargetType } from "./internal/TargetType.js";
import { reduceTokenToDicePartCore } from "./internal/reduceTokenToDicePartCore.js";
import { targetDataToTestData } from "./internal/targetDataToTestData.js";
export declare class QuestDicePart extends DicePart<DicePartCore<TargetType>, TargetType, GameSystemType> {
    static create<DicePartType extends TDicePart>({ description, target }?: DicePartCoreArgs): DicePartType;
    static readonly reduceTokenToCore: typeof reduceTokenToDicePartCore;
    static readonly targetDataToTestData: typeof targetDataToTestData;
    static readonly GameType = GameSystemType.Quest;
}
