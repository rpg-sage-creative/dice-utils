import { numberSorter } from "./numberSorter.js";
export function rollDataSorter(a, b) {
    const rollResult = numberSorter(a?.threshold ?? a?.value, b?.threshold ?? b?.value);
    if (rollResult !== 0) {
        return rollResult;
    }
    const indexResult = numberSorter(a?.index, b?.index);
    if (indexResult !== 0) {
        return indexResult;
    }
    return 0;
}
