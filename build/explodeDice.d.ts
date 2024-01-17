/**
 * Checks a set of die roll values for exloding dice, rolling exploded dice as needed
 * @param dieSize the size of the die being exploded
 * @param dieValues the values of the original roll
 * @param explodeValues which die values count as exploding
 * @returns all the new values rolled due to exploding dice
 */
export declare function explodeDice(dieSize: number, dieValues: number[], ...explodeValues: number[]): number[];
