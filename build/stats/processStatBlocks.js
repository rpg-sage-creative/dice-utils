import { doStatMath } from "./doStatMath.js";
import { hasStatBlock, replaceStatBlocks } from "./StatBlock.js";
export function processStatBlocks(diceString, args, stack = []) {
    if (!hasStatBlock(diceString))
        return diceString;
    let replaced = diceString;
    do {
        replaced = replaceStatBlocks(replaced, statBlock => {
            const { charName, isPcType, isAltType, stackValue, statKey, defaultValue } = statBlock;
            let char = null;
            if (isPcType) {
                char = args.pc ?? null;
            }
            else if (isAltType) {
                char = args.pc?.companions?.[0] ?? null;
            }
            else if (charName) {
                char = args.pcs.findByName(charName)
                    ?? args.pcs.findCompanion(charName)
                    ?? args.npcs.findByName(charName)
                    ?? args.npcs.findCompanion(charName)
                    ?? args.encounters?.findActiveChar(charName)
                    ?? null;
            }
            else {
                char = args.pc ?? null;
            }
            const statVal = char?.getStat(statKey);
            const statValue = statVal ?? defaultValue ?? "";
            if (statValue.length) {
                return processStatBlocks(statValue, args, stack.concat([stackValue]));
            }
            return null;
        }, stack);
    } while (hasStatBlock(replaced));
    return doStatMath(replaced);
}
