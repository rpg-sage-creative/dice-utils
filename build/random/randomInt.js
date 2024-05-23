import { randomInt as _randomInt } from "crypto";
export function randomInt(min, max) {
    if (min === max) {
        return min;
    }
    return _randomInt(Math.min(min, max), Math.max(min, max) + 1);
}
