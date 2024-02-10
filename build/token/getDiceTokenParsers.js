import { DiceTest } from "../DiceTest.js";
import { DiceDropKeep } from "../manipulate/DiceDropKeep.js";
import { DiceExplode } from "../manipulate/DiceExplode.js";
import { DiceThreshold } from "../manipulate/DiceThreshold.js";
export function getDiceTokenParsers() {
    return {
        dice: /([-+*/])?(?:\s*\((\s*\d*(?:\s*,\s*\d+)*\s*)\))?(?:\s*(\d+)\s*|\b)d\s*(\d+)/i,
        ...DiceDropKeep.getParsers(),
        ...DiceThreshold.getParsers(),
        ...DiceExplode.getParsers(),
        noSort: /(ns)/i,
        mod: /([-+*/])\s*(\d+)(?!d\d)/i,
        quotes: /`[^`]+`|“[^”]+”|„[^“]+“|„[^”]+”|"[^"]+"/,
        ...DiceTest.getParsers()
    };
}
