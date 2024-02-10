import { rollDataMapper } from "./internal/rollDataMapper.js";
import { rollDataSorter } from "./internal/rollDataSorter.js";
export function createSortedRollData(dicePart, markDropped) {
    const { fixedRolls, initialRolls, sides } = dicePart;
    const fixedRollsLength = fixedRolls?.length ?? 0;
    const byIndex = initialRolls.map((roll, index) => rollDataMapper(roll, index, sides, index < fixedRollsLength));
    const byRoll = byIndex.slice().sort(rollDataSorter);
    if (markDropped) {
        dicePart.manipulation.dropKeep.markDropped(byIndex);
    }
    return { byIndex: byIndex, byRoll: byRoll, length: initialRolls.length };
}
