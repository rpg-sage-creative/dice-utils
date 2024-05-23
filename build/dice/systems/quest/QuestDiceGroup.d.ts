import { type TDice } from "../../../dice/Dice.js";
import { type DiceBase } from "../../../dice/DiceBase.js";
import { DiceGroup, type DiceGroupCore, type DiceGroupCoreArgs, type TDiceGroup } from "../../../dice/DiceGroup.js";
import type { GameSystemType } from "../../../types/GameSystemType.js";
import { QuestDice } from "./QuestDice.js";
import { getTokenParsers } from "./internal/getTokenParsers.js";
export declare class QuestDiceGroup extends DiceGroup<DiceGroupCore, QuestDice, GameSystemType> {
    static create<DiceGroupType extends TDiceGroup, DiceType extends TDice>(dice: DiceType[], args?: DiceGroupCoreArgs): DiceGroupType;
    static readonly getTokenParsers: typeof getTokenParsers;
    static readonly Child: typeof DiceBase;
    static readonly GameType = GameSystemType.Quest;
}
