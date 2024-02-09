import { sum } from "../sum.js";
import { DiceDropKeep } from "./DiceDropKeep.js";
import { DiceExplode } from "./DiceExplode.js";
import { DiceThreshold } from "./DiceThreshold.js";
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
                dropKeep: dropKeep.toJSON(),
                explode: explode.toJSON(),
                noSort: noSort ? true : undefined,
                threshold: threshold.toJSON()
            });
            return true;
        }
    }
    return false;
}
export class DiceManipulator {
    data;
    diceCount;
    constructor(data, diceCount = 0) {
        this.data = data;
        this.diceCount = diceCount;
    }
    get adjustedCount() {
        if (this.isEmpty) {
            return this.diceCount;
        }
        return this.dropKeep?.adjustCount(this.diceCount) ?? this.diceCount;
    }
    get isEmpty() { return !!this.data?.length; }
    get dropKeep() { return new DiceDropKeep(this.data?.find(m => m.dropKeep)?.dropKeep); }
    get hasDropKeep() { return !this.dropKeep.isEmpty; }
    get noSort() { return this.data?.find(m => m.noSort)?.noSort === true; }
    toJSON() {
        return this.data;
    }
    toString() {
        return this.data?.map(m => {
            if (m.dropKeep) {
                return new DiceDropKeep(m.dropKeep).toString();
            }
            else if (m.explode) {
                return new DiceExplode(m.explode).toString();
            }
            else if (m.threshold) {
                return new DiceThreshold(m.threshold).toString();
            }
            return "";
        })
            .filter(s => s?.length)
            .join(" ") ?? "";
    }
}
export class DiceRollManipulator {
    manipulator;
    rolls;
    constructor(manipulator, rolls) {
        this.manipulator = manipulator;
        this.rolls = rolls;
    }
    get isEmpty() { return this.manipulator.isEmpty || this.rolls.length === 0; }
    get adjustedCount() {
        return this.manipulator.adjustedCount;
    }
    get adjustedRolls() {
        if (this.manipulator.isEmpty) {
            return this.rolls.slice();
        }
        return this.rolls.slice();
    }
    get adjustedSum() {
        if (this.manipulator.isEmpty) {
            return sum(this.rolls);
        }
        return this.manipulator.dropKeep?.adjustSum(this.rolls) ?? sum(this.rolls);
    }
}
