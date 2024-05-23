import { randomInt } from "./randomInt.js";
export function randomBoolean() {
    return randomInt(1, 2) === 2;
}
