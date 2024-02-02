import { rollDataMapper } from "./internal/rollDataMapper.js";
import { rollDataSorter } from "./internal/rollDataSorter.js";
export function createSortedRollData({ dice, rolls }) {
    const { fixedRolls, sides } = dice;
    const fixedRollsLength = fixedRolls?.length ?? 0;
    const byIndex = rolls.map((roll, index) => rollDataMapper(roll, index, sides, index < fixedRollsLength));
    const byRoll = byIndex.slice().sort(rollDataSorter);
    return { byIndex: byIndex, byRoll: byRoll, length: rolls.length };
}
