import { debug } from "@rsc-utils/console-utils";
import { rollDataMapper } from "../internal/rollDataMapper.js";
import { rollDataSorter } from "../internal/rollDataSorter.js";
import { markRollData } from "../markup/markRollData.js";
import { sum } from "../sum.js";
import { rollDice } from "./rollDice.js";
export function rollDicePart(dicePart) {
    const { fixedRolls, count, sides } = dicePart;
    const byIndex = fixedRolls.map((roll, index) => rollDataMapper(roll, index, sides, true));
    if (byIndex.length < count) {
        byIndex.push(...rollDice(count, sides).map(roll => rollDataMapper(roll, byIndex.length, sides, false)));
    }
    debug({ fixedRolls, byIndex });
    const initialCount = byIndex.length;
    const initialSum = sum(byIndex.map(roll => roll.outputValue));
    let noSort = false;
    dicePart.manipulation.forEach(m => {
        const rolls = byIndex.filter(roll => !roll.isDropped);
        m.dropKeep?.manipulateRolls(rolls);
        m.explode?.manipulateRolls(rolls);
        m.threshold?.manipulateRolls(rolls);
        if (m.noSort)
            noSort = true;
    });
    byIndex.forEach(markRollData);
    const notDropped = byIndex.filter(roll => !roll.isDropped);
    return {
        byIndex,
        byValue: byIndex.slice().sort(rollDataSorter),
        count: notDropped.length,
        initialCount,
        initialSum,
        noSort,
        sum: sum(notDropped.map(roll => roll.outputValue))
    };
}
