import { rollDataMapper } from "./internal/rollDataMapper.js";
import { rollDataSorter } from "./internal/rollDataSorter.js";
export function createSortedRollData(dicePartRoll, markDropped) {
    const { dice, rolls } = dicePartRoll;
    const { fixedRolls, sides } = dice;
    const fixedRollsLength = fixedRolls?.length ?? 0;
    const byIndex = rolls.map((roll, index) => rollDataMapper(roll, index, sides, index < fixedRollsLength));
    const byRoll = byIndex.slice().sort(rollDataSorter);
    if (markDropped) {
        dicePartRoll.dice.dropKeep.markDropped(byIndex);
    }
    return { byIndex: byIndex, byRoll: byRoll, length: rolls.length };
}
