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
    constructor(data) {
        this.data = data;
    }
    get adjustedCount() {
        if (this.hasRolls) {
            if (this.isEmpty) {
                return this.rolls.length;
            }
            return this.dropKeep?.adjustCount(this.rolls.length) ?? this.rolls.length;
        }
        return 0;
    }
    get adjustedRolls() {
        if (this.hasRolls) {
            if (this.isEmpty) {
                return this.rolls.slice();
            }
            return this.rolls.slice();
        }
        return [];
    }
    get adjustedSum() {
        if (this.hasRolls) {
            if (this.isEmpty) {
                return sum(this.rolls);
            }
            return this.dropKeep?.adjustSum(this.rolls) ?? sum(this.rolls);
        }
        return 0;
    }
    get dropKeep() { return new DiceDropKeep(this.data?.find(m => m.dropKeep)?.dropKeep); }
    get hasDropKeep() { return !this.dropKeep.isEmpty; }
    get hasRolls() { return !!this._rolls?.length; }
    get isEmpty() { return !!this.data?.length; }
    _rolls;
    get rolls() { return this._rolls?.slice() ?? []; }
    manipulate(rolls) {
        if (this.hasRolls) {
            return;
        }
        this._rolls = rolls;
    }
    get noSort() { return this.data?.find(m => m.noSort)?.noSort === true; }
    toJSON() { return this.data; }
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
