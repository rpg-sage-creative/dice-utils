import { markAsFixed, markAsMax, markAsMin } from "../markup.js";
export function rollDataMapper(roll, index, sides, isFixed) {
    let output = String(roll);
    if (isFixed) {
        output = markAsFixed(output);
    }
    const isMax = roll === sides;
    if (isMax) {
        output = markAsMax(output);
    }
    const isMin = roll === 1;
    if (isMin) {
        output = markAsMin(output);
    }
    return { index, isFixed, isMax, isMin, output, roll };
}
