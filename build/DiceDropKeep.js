import { strike } from "./markup.js";
import { sum } from "./sum.js";
function sortNumbers(a, b) {
    if (a < b) {
        return -1;
    }
    else if (a > b) {
        return 1;
    }
    return 0;
}
export var DiceDropKeepType;
(function (DiceDropKeepType) {
    DiceDropKeepType[DiceDropKeepType["None"] = 0] = "None";
    DiceDropKeepType[DiceDropKeepType["DropLowest"] = 1] = "DropLowest";
    DiceDropKeepType[DiceDropKeepType["DropHighest"] = 2] = "DropHighest";
    DiceDropKeepType[DiceDropKeepType["KeepLowest"] = 3] = "KeepLowest";
    DiceDropKeepType[DiceDropKeepType["KeepHighest"] = 4] = "KeepHighest";
})(DiceDropKeepType || (DiceDropKeepType = {}));
function isDropped(_roll, index, rolls) {
    switch (this.type) {
        case DiceDropKeepType.DropHighest:
            return index >= (rolls.length - this.value);
        case DiceDropKeepType.DropLowest:
            return index < this.value;
        case DiceDropKeepType.KeepHighest:
            return index < (rolls.length - this.value);
        case DiceDropKeepType.KeepLowest:
            return index >= this.value;
        default: return false;
    }
}
export class DiceDropKeep {
    data;
    constructor(data) {
        this.data = data;
    }
    get alias() { return this.data?.alias ?? ""; }
    get isEmpty() { return !this.type || !this.value; }
    get type() { return this.data?.type ?? DiceDropKeepType.None; }
    get value() { return this.data?.value ?? 0; }
    adjustCount(count) {
        if (!this.isEmpty) {
            switch (this.type) {
                case DiceDropKeepType.DropHighest:
                case DiceDropKeepType.DropLowest:
                    return count - this.value;
                case DiceDropKeepType.KeepHighest:
                case DiceDropKeepType.KeepLowest:
                    return this.value;
            }
        }
        return count;
    }
    strikeDropped(rolls) {
        if (!this.isEmpty) {
            DiceDropKeep.sort(rolls)
                .filter(isDropped, this.data)
                .forEach(roll => roll.output = strike(roll.output));
        }
    }
    adjustSum(values) {
        if (!this.isEmpty) {
            const sorted = values.slice().sort(sortNumbers);
            switch (this.type) {
                case DiceDropKeepType.DropHighest:
                    return sum(sorted.slice(0, -this.value));
                case DiceDropKeepType.DropLowest:
                    return sum(sorted.slice(this.value));
                case DiceDropKeepType.KeepHighest:
                    return sum(sorted.slice(-this.value));
                case DiceDropKeepType.KeepLowest:
                    return sum(sorted.slice(0, this.value));
            }
            console.warn(`Invalid dropKeep.type = ${this.type} (${DiceDropKeepType[this.type]})`);
        }
        return sum(values);
    }
    toJSON() {
        return this.data;
    }
    toString(leftPad = "", rightPad = "") {
        if (this.isEmpty) {
            return ``;
        }
        if (["dl", "dh", "kl", "kh"].includes(this.alias)) {
            return `${leftPad}${this.alias} ${this.value}${rightPad}`;
        }
        return `${leftPad}(${this.alias})${rightPad}`;
    }
    static getParsers() {
        return { dropKeep: /(dl|dh|kl|kh)\s*(\d+)?/i };
    }
    static parse(token) {
        if (token?.key === "dropKeep") {
            const alias = token.matches[0].toLowerCase().slice(0, 2);
            const type = [null, "dl", "dh", "kl", "kh"].indexOf(alias);
            const value = +token.matches[1] || 1;
            return { alias, type, value };
        }
        return undefined;
    }
    static sort(rolls) {
        const sorted = rolls.slice();
        sorted.sort((a, b) => {
            const byRoll = sortNumbers(a.roll, b.roll);
            if (byRoll !== 0) {
                return byRoll;
            }
            return sortNumbers(a.index, b.index);
        });
        return sorted;
    }
}
