import { DiceOperator } from "./types/DiceOperator.js";
type THasSignAndTotal = {
    sign?: DiceOperator;
    total: number;
};
export declare function sumDicePartRolls(dicePartRolls: THasSignAndTotal[]): number;
export {};
