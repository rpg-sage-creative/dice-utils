export var DiceThresholdType;
(function (DiceThresholdType) {
    DiceThresholdType[DiceThresholdType["None"] = 0] = "None";
    DiceThresholdType[DiceThresholdType["LowestThreshold"] = 1] = "LowestThreshold";
    DiceThresholdType[DiceThresholdType["HighestThreshold"] = 2] = "HighestThreshold";
})(DiceThresholdType || (DiceThresholdType = {}));
export class DiceThreshold {
    data;
    constructor(data) {
        this.data = data;
    }
    get alias() { return this.data?.alias ?? ""; }
    get isEmpty() { return !this.type || !this.value; }
    get type() { return this.data?.type ?? DiceThresholdType.None; }
    get value() { return this.data?.value ?? 0; }
    update(dieValues) {
        return dieValues.map(value => this.shouldUpdate(value) ? this.value : value);
    }
    shouldUpdate(value) {
        if (!this.isEmpty) {
            switch (this.type) {
                case DiceThresholdType.HighestThreshold: return value > this.value;
                case DiceThresholdType.LowestThreshold: return value < this.value;
                case DiceThresholdType.None: return false;
            }
        }
        return false;
    }
    toJSON() {
        return this.data;
    }
    toString(leftPad, rightPad) {
        if (this.isEmpty) {
            return ``;
        }
        if (["lt", "bt", "ht", "tt"].includes(this.alias)) {
            return `${leftPad}${this.alias} ${this.value}${rightPad}`;
        }
        return `${leftPad}(${this.alias})${rightPad}`;
    }
    static getParsers() {
        return { threshold: /(bt|lt|ht|tt)\s*(\d+)/i };
    }
    static parseData(token) {
        if (token?.key === "threshold") {
            const alias = token.matches[0].toLowerCase().slice(0, 2);
            const replaced = alias.replace(/bt/, "lt").replace(/tt/, "ht");
            const type = [null, "lt", "ht"].indexOf(replaced);
            const value = +token.matches[1] || 1;
            return { alias, type, value };
        }
        return undefined;
    }
    static from(token) {
        return new DiceThreshold(DiceThreshold.parseData(token));
    }
}
