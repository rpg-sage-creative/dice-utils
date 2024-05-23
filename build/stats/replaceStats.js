import { doStatMath } from "./doStatMath.js";
export function replaceStats(diceString, args, stack = []) {
    let replaced = diceString;
    while (args.statRegex.test(replaced)) {
        replaced = replaced.replace(new RegExp(args.statRegex, "gi"), match => {
            const [_, name, stat, defaultValue] = args.statRegex.exec(match) ?? [];
            const stackValue = `${name}::${stat}`.toLowerCase();
            if (stack.includes(stackValue)) {
                return `\`${match}\``;
            }
            let char = null;
            if (name) {
                const [_, isPc, isAlt] = args.typeRegex.exec(name) ?? [];
                if (isPc) {
                    char = args.pc ?? null;
                }
                else if (isAlt) {
                    char = args.pc?.companions[0] ?? null;
                }
                else {
                    char = args.pcs.findByName(name)
                        ?? args.pcs.findCompanion(name)
                        ?? args.npcs.findByName(name)
                        ?? args.npcs.findCompanion(name)
                        ?? args.encounters?.findActiveChar(name)
                        ?? null;
                }
            }
            else {
                char = args.pc ?? null;
            }
            const statVal = char?.getStat(stat);
            const statValue = statVal ?? defaultValue?.trim() ?? "";
            if (statValue.length) {
                if (args.statRegex.test(statValue)) {
                    return replaceStats(statValue, args, stack.concat([stackValue]));
                }
                return statValue;
            }
            return `\`${match}\``;
        });
        return doStatMath(replaced);
    }
    return replaced;
}
