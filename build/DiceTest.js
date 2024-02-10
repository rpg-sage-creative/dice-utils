export var DiceTestType;
(function (DiceTestType) {
    DiceTestType[DiceTestType["None"] = 0] = "None";
    DiceTestType[DiceTestType["Equal"] = 1] = "Equal";
    DiceTestType[DiceTestType["GreaterThan"] = 2] = "GreaterThan";
    DiceTestType[DiceTestType["GreaterThanOrEqual"] = 3] = "GreaterThanOrEqual";
    DiceTestType[DiceTestType["LessThan"] = 4] = "LessThan";
    DiceTestType[DiceTestType["LessThanOrEqual"] = 5] = "LessThanOrEqual";
})(DiceTestType || (DiceTestType = {}));
export function parseDiceTestType(matchValue) {
    const testType = matchValue.replace(/=+/g, "=").toLowerCase();
    if (["eq", "="].includes(testType)) {
        return DiceTestType.Equal;
    }
    if (["gt", ">"].includes(testType)) {
        return DiceTestType.GreaterThan;
    }
    if (["lt", "<"].includes(testType)) {
        return DiceTestType.LessThan;
    }
    if (["gteq", "gte", ">="].includes(testType)) {
        return DiceTestType.GreaterThanOrEqual;
    }
    if (["lteq", "lte", "<="].includes(testType)) {
        return DiceTestType.LessThanOrEqual;
    }
    return DiceTestType.None;
}
export function parseDiceTestTargetValue(rawValue) {
    const hidden = rawValue.length > 4 && rawValue.startsWith("||") && rawValue.endsWith("||");
    const value = +(hidden ? rawValue.slice(2, -2) : rawValue) || 0;
    return { value, hidden };
}
export function appendTestToCore(core, token, _index, _tokens) {
    const diceTest = DiceTest.from(token);
    if (!diceTest.isEmpty) {
        core.test = diceTest.toJSON();
        return true;
    }
    return false;
}
export class DiceTest {
    data;
    constructor(data) {
        this.data = data;
    }
    get alias() { return this.data?.alias ?? ""; }
    get isHidden() { return this.data?.hidden ?? false; }
    get isEmpty() { return !this.data?.type || isNaN(this.data.value); }
    get type() { return this.data?.type ?? DiceTestType.None; }
    get value() { return this.data?.value ?? 0; }
    test(total) {
        if (!this.isEmpty) {
            switch (this.type) {
                case DiceTestType.Equal:
                    return total === this.value;
                case DiceTestType.GreaterThan:
                    return total > this.value;
                case DiceTestType.GreaterThanOrEqual:
                    return total >= this.value;
                case DiceTestType.LessThan:
                    return total < this.value;
                case DiceTestType.LessThanOrEqual:
                    return total <= this.value;
                default:
                    console.warn(`testRoll(): invalid roll.dice.test.type = ${this.type} (${this.alias})`);
            }
        }
        return undefined;
    }
    toJSON() {
        return this.data;
    }
    toString(leftPad = "", rightPad = "") {
        if (this.isEmpty) {
            return ``;
        }
        const value = this.isHidden ? "??" : this.value;
        return `${leftPad}${this.alias} ${value}${rightPad}`;
    }
    static getParsers() {
        return { test: /(gteq|gte|gt|lteq|lte|lt|eq|=+|>=|>|<=|<)\s*(\d+|\|\|\d+\|\|)/i };
    }
    static createData(type, value, hidden, alias) {
        if (!alias) {
            alias = [undefined, "=", ">", ">=", "<", "<="][type];
        }
        return { type, value, hidden, alias };
    }
    static parseData(token) {
        if (token.key === "test") {
            const type = parseDiceTestType(token.matches[0]);
            const { value, hidden } = parseDiceTestTargetValue(token.matches[1]);
            return DiceTest.createData(type, value, hidden);
        }
        return undefined;
    }
    static from(token) {
        return new DiceTest(DiceTest.parseData(token));
    }
    static test(dice) {
        return dice.test.test(dice.total);
    }
    static EmptyTest = new DiceTest();
}
