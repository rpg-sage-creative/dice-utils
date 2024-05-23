import { parseDiceTestTargetValue } from "../../../../DiceTest.js";
import { TargetType } from "./TargetType.js";
export function reduceTokenToCnCDicePartCore(core, token) {
    if (token.key === "dice") {
        core.count = +token.matches[0];
        core.sides = 12;
    }
    else if (token.key === "target") {
        const { value, hidden } = parseDiceTestTargetValue(token.matches[1]);
        core.target = { type: TargetType.VS, value, hidden };
    }
    else {
        core.description = (core.description ?? "") + token.token;
    }
    return core;
}
