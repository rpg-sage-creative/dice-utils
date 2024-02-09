import { randomInt } from "@rsc-utils/random-utils";
export function rollDie(sides) {
    return randomInt(1, sides);
}
