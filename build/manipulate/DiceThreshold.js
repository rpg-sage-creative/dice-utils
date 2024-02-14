import { DiceManipulation } from "./DiceManipulation.js";
export var DiceThresholdType;
(function (DiceThresholdType) {
    DiceThresholdType[DiceThresholdType["None"] = 0] = "None";
    DiceThresholdType[DiceThresholdType["BottomThreshold"] = 1] = "BottomThreshold";
    DiceThresholdType[DiceThresholdType["TopThreshold"] = 2] = "TopThreshold";
})(DiceThresholdType || (DiceThresholdType = {}));
export class DiceThreshold extends DiceManipulation {
    get alias() { return this.data?.alias ?? ""; }
    get type() { return this.data?.type ?? DiceThresholdType.None; }
    get value() { return this.data?.value ?? 0; }
    manipulateRolls(rolls) {
        if (!this.isEmpty) {
            rolls.forEach(roll => {
                if (this.shouldUpdate(roll.threshold ?? roll.value)) {
                    roll.threshold = this.value;
                    if (this.type === DiceThresholdType.TopThreshold) {
                        roll.isAboveThreshold = true;
                    }
                    else {
                        roll.isBelowThreshold = true;
                    }
                }
            });
        }
    }
    shouldUpdate(value) {
        if (!this.isEmpty) {
            switch (this.type) {
                case DiceThresholdType.TopThreshold: return value > this.value;
                case DiceThresholdType.BottomThreshold: return value < this.value;
                case DiceThresholdType.None: return false;
            }
        }
        return false;
    }
    toJSON() {
        return this.data;
    }
    toString(leftPad = "", rightPad = "") {
        if (this.isEmpty) {
            return ``;
        }
        if (["bt", "tt"].includes(this.alias)) {
            return `${leftPad}${this.alias}${this.value}${rightPad}`;
        }
        return `${leftPad}(${this.alias})${rightPad}`;
    }
    static getParsers() {
        return { threshold: /(bt|tt)\s*(\d+)/i };
    }
    static parseData(token) {
        if (token?.key === "threshold") {
            const alias = token.matches[0].toLowerCase().slice(0, 2);
            const type = [null, "bt", "tt"].indexOf(alias);
            const value = +token.matches[1];
            return { alias, type, value };
        }
        return undefined;
    }
}
