import { TDicePartRoll } from "./dice/DicePartRoll.js";
type MapDicePartRollOptions = {
    hideRolls: boolean;
    isRollem?: boolean;
    noDescription?: boolean;
    noDice?: boolean;
    noModifier?: boolean;
};
export declare function mapDicePartRollToString(dicePartRoll: TDicePartRoll, dicePartIndex: number, options: MapDicePartRollOptions): string;
export {};
