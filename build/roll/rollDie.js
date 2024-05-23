import { randomInt } from "../random/randomInt.js";
export function rollDie(sides) {
    return randomInt(1, sides);
}
