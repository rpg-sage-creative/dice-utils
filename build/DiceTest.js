export var DiceTestType;
(function (DiceTestType) {
    DiceTestType[DiceTestType["None"] = 0] = "None";
    DiceTestType[DiceTestType["Equal"] = 1] = "Equal";
    DiceTestType[DiceTestType["GreaterThan"] = 2] = "GreaterThan";
    DiceTestType[DiceTestType["GreaterThanOrEqual"] = 3] = "GreaterThanOrEqual";
    DiceTestType[DiceTestType["LessThan"] = 4] = "LessThan";
    DiceTestType[DiceTestType["LessThanOrEqual"] = 5] = "LessThanOrEqual";
})(DiceTestType || (DiceTestType = {}));
function parseDiceTestType(matchValue) {
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
function parseDiceTestTargetValue(rawValue) {
    const hidden = rawValue.length > 4 && rawValue.startsWith("||") && rawValue.endsWith("||");
    const value = +(hidden ? rawValue.slice(2, -2) : rawValue) || 0;
    return { value, hidden };
}
export class DiceTest {
    core;
    constructor(core) {
        this.core = core;
    }
    get alias() { return this.core?.alias ?? ""; }
    get isEmpty() { return !this.core?.type || isNaN(this.core.value); }
    get type() { return this.core?.type ?? DiceTestType.None; }
    get value() { return this.core?.value ?? 0; }
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
        return this.core;
    }
    static getParsers() {
        return { test: /(gteq|gte|gt|lteq|lte|lt|eq|=+|>=|>|<=|<)\s*(\d+|\|\|\d+\|\|)/i };
    }
    static parse(token) {
        if (token.key === "test") {
            const type = parseDiceTestType(token.matches[0]);
            const { value, hidden } = parseDiceTestTargetValue(token.matches[1]);
            return this.create(type, value, hidden);
        }
        return undefined;
    }
    static create(type, value, hidden, alias) {
        if (!alias) {
            alias = [undefined, "=", ">", ">=", "<", "<="][type];
        }
        return { type, value, hidden, alias };
    }
    static test(roll) {
        return new DiceTest(roll.dice.test).test(roll.total);
    }
}
