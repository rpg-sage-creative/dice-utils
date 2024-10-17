import { sum } from "@rsc-utils/core-utils";
import { rollDataMapper } from "../internal/rollDataMapper.js";
import { rollDataSorter } from "../internal/rollDataSorter.js";
import { markRollData } from "../markup/markRollData.js";
import { rollDice } from "./rollDice.js";
export function rollDicePart(dicePart) {
    const { fixedRolls, count, sides } = dicePart;
    const byIndex = fixedRolls.map((roll, index) => rollDataMapper(roll, index, sides, true));
    if (byIndex.length < count) {
        byIndex.push(...rollDice(count, sides).map(roll => rollDataMapper(roll, byIndex.length, sides, false)));
    }
    const initialCount = byIndex.length;
    const initialSum = sum(byIndex.map(roll => roll.value));
    let noSort = false;
    dicePart.manipulation.forEach(m => {
        const rolls = byIndex.filter(roll => !roll.isDropped);
        if (m.dropKeep) {
            m.dropKeep.manipulateRolls(rolls);
        }
        else if (m.explode) {
            byIndex.push(...m.explode.manipulateRolls(rolls));
        }
        else if (m.threshold) {
            m.threshold.manipulateRolls(rolls);
        }
        else if (m.noSort) {
            noSort = true;
        }
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
        sum: sum(notDropped.map(roll => roll.threshold ?? roll.value))
    };
}
