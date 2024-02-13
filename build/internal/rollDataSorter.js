import { numberSorter } from "./numberSorter.js";
export function rollDataSorter(a, b) {
    const rollResult = numberSorter(a?.outputValue, b?.outputValue);
    if (rollResult !== 0) {
        return rollResult;
    }
    const indexResult = numberSorter(a?.index, b?.index);
    if (indexResult !== 0) {
        return indexResult;
    }
    return 0;
}
