import { DiceCriticalMethodType } from "../types/DiceCriticalMethodType.js";
import { DiceOutputType } from "../types/DiceOutputType.js";
import { DiceSecretMethodType } from "../types/DiceSecretMethodType.js";
import { type DiceCore, type TDice } from "./Dice.js";
import { DiceBase, type DiceBaseCore } from "./DiceBase.js";
type DiceGroupCoreBase = {
    criticalMethodType?: DiceCriticalMethodType;
    outputType?: DiceOutputType;
    secretMethodType?: DiceSecretMethodType;
};
export type DiceGroupCoreArgs = Partial<DiceGroupCoreBase>;
export type DiceGroupCore<GameType extends number = number> = DiceGroupCoreBase & DiceBaseCore<DiceCore, "DiceGroup", GameType>;
export type TDiceGroup = DiceGroup<DiceGroupCore, TDice>;
export declare class DiceGroup<CoreType extends DiceGroupCore<GameType>, ChildType extends TDice, GameType extends number = number> extends DiceBase<CoreType, ChildType, "DiceGroup", GameType> {
    get criticalMethodType(): DiceCriticalMethodType | undefined;
    get outputType(): DiceOutputType | undefined;
    get primary(): ChildType | undefined;
    get secretMethodType(): DiceSecretMethodType | undefined;
    toDiceString(outputType?: DiceOutputType): string;
    toRollString(...args: (boolean | DiceOutputType)[]): string;
    static create<DiceGroupType extends TDiceGroup, DiceType extends TDice>(dice: DiceType[], args?: DiceGroupCoreArgs): DiceGroupType;
    static fromCore<CoreType extends DiceGroupCore, DiceGroupType extends TDiceGroup>(core: CoreType): DiceGroupType;
    static parse<DiceType extends TDiceGroup>(diceString: string, outputType?: DiceOutputType): DiceType;
    static readonly Child: typeof DiceBase;
}
export {};
