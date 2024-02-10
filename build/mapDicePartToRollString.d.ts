import { TDicePart } from "./dice/DicePart.js";
type MapDicePartRollOptions = {
    hideRolls: boolean;
    isRollem?: boolean;
    noDescription?: boolean;
    noDice?: boolean;
    noModifier?: boolean;
};
export declare function mapDicePartToRollString(dicePart: TDicePart, dicePartIndex: number, options: MapDicePartRollOptions): string;
export {};
