import { SimpleDice } from "./SimpleDice.js";
/**
 * Returns the results of rolling simple dice: 1d6 or 1d8+1 or 1d10-2.
 * Returns null if the input isn't a valid simple dice roll, or has 0 count or 0 sides.
 */
export declare function rollDiceString(diceString: SimpleDice): number | null;
