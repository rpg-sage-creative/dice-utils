import { rollDataSorter } from "../internal/rollDataSorter.js";
import { DiceManipulation } from "./DiceManipulation.js";
export var DiceDropKeepType;
(function (DiceDropKeepType) {
    DiceDropKeepType[DiceDropKeepType["None"] = 0] = "None";
    DiceDropKeepType[DiceDropKeepType["DropLowest"] = 1] = "DropLowest";
    DiceDropKeepType[DiceDropKeepType["DropHighest"] = 2] = "DropHighest";
    DiceDropKeepType[DiceDropKeepType["KeepLowest"] = 3] = "KeepLowest";
    DiceDropKeepType[DiceDropKeepType["KeepHighest"] = 4] = "KeepHighest";
})(DiceDropKeepType || (DiceDropKeepType = {}));
function shouldBeDropped(_roll, index, rolls) {
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
export class DiceDropKeep extends DiceManipulation {
    get alias() { return this.data?.alias ?? ""; }
    get type() { return this.data?.type ?? DiceDropKeepType.None; }
    get value() { return this.data?.value ?? 0; }
    manipulateRolls(rolls) {
        if (!this.isEmpty) {
            const sorted = rolls.slice();
            sorted.sort(rollDataSorter);
            sorted.filter(shouldBeDropped, this.data).forEach(roll => {
                roll.isDropped = true;
            });
        }
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
    static parseData(token) {
        if (token?.key === "dropKeep") {
            const alias = token.matches[0].toLowerCase().slice(0, 2);
            const type = [null, "dl", "dh", "kl", "kh"].indexOf(alias);
            const value = +token.matches[1] || 1;
            return { alias, type, value };
        }
        return undefined;
    }
    static from(token) {
        return new DiceDropKeep(DiceDropKeep.parseData(token));
    }
}
