import { randomInt } from "./randomInt.js";
export function shuffle(array) {
    const shuffled = array.slice();
    do {
        let currentIndex = shuffled.length;
        while (0 !== currentIndex) {
            const randomIndex = randomInt(1, currentIndex) - 1;
            currentIndex -= 1;
            const temporaryValue = shuffled[currentIndex];
            shuffled[currentIndex] = shuffled[randomIndex];
            shuffled[randomIndex] = temporaryValue;
        }
    } while (!shuffled.find((value, index) => value !== array[index]));
    return shuffled;
}
