import { randomInt } from "./randomInt.js";
export function randomItem(array) {
    return array.length === 0
        ? null
        : array[randomInt(1, array.length) - 1];
}
