import { appendTestToCore } from "../DiceTest.js";
import { appendManipulationToCore } from "../manipulate/DiceManipulator.js";
function reduceDiceToken(core, token, reduceSignToDropKeepData) {
    if (token.key === "dice") {
        let hasChanges = false;
        if (token.matches) {
            core.sign = token.matches[0];
            core.fixedRolls = (token.matches[1] ?? "").split(",").map(s => +s.trim()).filter(n => n);
            core.count = +token.matches[2] || 0;
            core.sides = +token.matches[3] || 0;
            if (!core.count && core.sides) {
                core.count = 1;
            }
            hasChanges = true;
        }
        const dropKeep = reduceSignToDropKeepData?.find(dropKeepData => dropKeepData.test(core, token));
        if (dropKeep) {
            const manipulation = core.manipulation ?? (core.manipulation = []);
            manipulation.push({ dropKeep });
            delete core.sign;
            hasChanges = true;
        }
        return hasChanges;
    }
    return false;
}
function reduceModToken(core, token) {
    if (token.key === "mod" && token.matches) {
        core.sign = token.matches[0];
        core.modifier = +token.matches[1] || 0;
    }
    return core;
}
function reduceDescriptionToken(core, token) {
    core.description = (core.description ?? "") + token.token;
    return core;
}
export function reduceTokenToDicePartCore(core, token, index, tokens, reduceSignToDropKeepData) {
    if (reduceDiceToken(core, token, reduceSignToDropKeepData)) {
        return core;
    }
    if (appendManipulationToCore(core, token, index, tokens)) {
        return core;
    }
    if (appendTestToCore(core, token, index, tokens)) {
        return core;
    }
    if (reduceModToken(core, token)) {
        return core;
    }
    return reduceDescriptionToken(core, token);
}
