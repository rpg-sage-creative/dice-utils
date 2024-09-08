import { doStatMath } from "./doStatMath.js";
import { hasStatBlock, replaceStatBlocks } from "./StatBlock.js";
export function processStatBlocks(diceString, args, stack = []) {
    let replaced = diceString;
    while (hasStatBlock(replaced)) {
        replaced = replaceStatBlocks(replaced, statBlock => {
            const { charName, isPcType, isAltType, stackValue, statKey, defaultValue } = statBlock;
            let char;
            if (isPcType) {
                char = args.pc ?? undefined;
            }
            else if (isAltType) {
                char = args.pc?.companions?.[0] ?? undefined;
            }
            else if (charName) {
                char = args.pcs.findByName(charName)
                    ?? args.pcs.findCompanion(charName)
                    ?? args.npcs.findByName(charName)
                    ?? args.npcs.findCompanion(charName)
                    ?? args.encounters?.findActiveChar(charName)
                    ?? undefined;
            }
            else {
                char = args.pc ?? undefined;
            }
            const statVal = char?.getStat(statKey);
            const statValue = statVal ?? defaultValue ?? "";
            if (statValue.length) {
                return processStatBlocks(statValue, args, stack.concat([stackValue]));
            }
            return undefined;
        }, stack);
    }
    return doStatMath(replaced);
}
