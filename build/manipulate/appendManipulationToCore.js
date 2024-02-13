import { DiceDropKeep } from "./DiceDropKeep.js";
import { DiceExplode } from "./DiceExplode.js";
import { DiceThreshold } from "./DiceThreshold.js";
function notEmpty(dm) {
    return dm.isEmpty ? undefined : dm;
}
export function appendManipulationToCore(core, token, index, tokens) {
    const lastToken = tokens[index - 1];
    if (["dice", "dropKeep", "explode", "noSort", "threshold"].includes(lastToken?.key)) {
        const dropKeep = DiceDropKeep.from(token);
        const explode = DiceExplode.from(token);
        const noSort = token.key === "noSort";
        const threshold = DiceThreshold.from(token);
        if (!dropKeep.isEmpty || !explode.isEmpty || noSort || !threshold.isEmpty) {
            const manipulation = core.manipulation ?? (core.manipulation = []);
            manipulation.push({
                dropKeep: notEmpty(dropKeep),
                explode: notEmpty(explode),
                noSort: noSort ? true : undefined,
                threshold: notEmpty(threshold)
            });
            return true;
        }
    }
    return false;
}
