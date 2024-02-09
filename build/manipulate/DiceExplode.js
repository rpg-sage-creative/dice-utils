import { DiceTestType } from "../DiceTest.js";
import { rollDie } from "../rollDie.js";
export class DiceExplode {
    data;
    constructor(data) {
        this.data = data;
    }
    get alias() { return this.data?.alias ?? ""; }
    get isEmpty() { return !this.type || !this.value; }
    get type() { return this.data?.type ?? DiceTestType.None; }
    get value() { return this.data?.value ?? 0; }
    explode(dieSize, dieValues) {
        const explodedValues = [];
        let extra = dieValues.filter(value => this.shouldExplode(value)).length;
        while (extra > 0) {
            const rollValue = rollDie(dieSize);
            explodedValues.push(rollValue);
            if (!this.shouldExplode(rollValue)) {
                extra--;
            }
        }
        return explodedValues;
    }
    shouldExplode(value) {
        if (!this.isEmpty) {
            switch (this.type) {
                case DiceTestType.GreaterThan: return value > this.value;
                case DiceTestType.GreaterThanOrEqual: return value >= this.value;
                case DiceTestType.Equal: return value === this.value;
                case DiceTestType.LessThanOrEqual: return value <= this.value;
                case DiceTestType.LessThan: return value < this.value;
                case DiceTestType.None: return false;
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
        if (this.alias === "x") {
            const test = ["", "", ">", ">=", "<", "<="][this.type];
            const output = ["x", test, this.value].filter(value => value).join(" ");
            return `${leftPad}${output}${rightPad}`;
        }
        return `${leftPad}(${this.alias})${rightPad}`;
    }
    static getParsers() {
        return { explode: /((x)\s*(<=|<|>=|>|=)?\s*(\d+)?)/i };
    }
    static parseData(token) {
        if (token.key === "explode") {
            const alias = token.matches[0].toLowerCase();
            const type = ["", "=", ">", ">=", "<", "<="].indexOf(token.matches[1] ?? "=");
            const value = +token.matches[2] || 0;
            return { alias, type, value };
        }
        return undefined;
    }
    static from(token) {
        return new DiceExplode(DiceExplode.parseData(token));
    }
    static explode(dieSize, dieValues) {
        const exploder = new DiceExplode({ alias: "x", type: DiceTestType.Equal, value: dieSize });
        return exploder.explode(dieSize, dieValues);
    }
}
