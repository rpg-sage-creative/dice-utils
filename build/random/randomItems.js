import { randomItem } from "./randomItem.js";
export function randomItems(array, count, unique) {
    const selections = [];
    const total = unique === true ? Math.min(array.length, count) : count;
    if (total > 0) {
        do {
            const randomValue = randomItem(array);
            if (!unique || !selections.includes(randomValue)) {
                selections.push(randomValue);
            }
        } while (selections.length < total);
    }
    return selections;
}
