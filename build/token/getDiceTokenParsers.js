import { DiceTest } from "../DiceTest.js";
import { DiceDropKeep } from "../manipulate/DiceDropKeep.js";
import { DiceExplode } from "../manipulate/DiceExplode.js";
import { DiceThreshold } from "../manipulate/DiceThreshold.js";
import { getDiceRegex } from "./getDiceRegex.js";
export function getDiceTokenParsers() {
    return {
        dice: getDiceRegex(),
        ...DiceDropKeep.getParsers(),
        ...DiceThreshold.getParsers(),
        ...DiceExplode.getParsers(),
        noSort: /(ns)/i,
        mod: /([\-+\/*])\s*(\d+)(?!d\d)/i,
        quotes: /`[^`]+`|“[^”]+”|„[^“]+“|„[^”]+”|"[^"]+"/,
        ...DiceTest.getParsers()
    };
}
