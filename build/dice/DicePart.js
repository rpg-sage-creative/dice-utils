import { HasIdCore } from "@rsc-utils/class-utils";
import { randomSnowflake } from "@rsc-utils/snowflake-utils";
import { DiceTest } from "../DiceTest.js";
import { cleanDicePartDescription } from "../cleanDicePartDescription.js";
import { hasSecretFlag } from "../internal/hasSecretFlag.js";
import { DiceManipulator } from "../manipulate/DiceManipulator.js";
import { reduceTokenToDicePartCore } from "../reduceTokenToDicePartCore.js";
import { DiceOutputType } from "../types/DiceOutputType.js";
export class DicePart extends HasIdCore {
    get gameType() { return this.core.gameType; }
    get count() { return this.core.count; }
    get description() { return this.core.description; }
    get hasDescription() { return this.core.description.length > 0; }
    get fixedRolls() { return this.core.fixedRolls ?? []; }
    _manipulation;
    get manipulation() { return this._manipulation ?? (this._manipulation = new DiceManipulator(this.core.manipulation)); }
    get hasManipulation() { return !this.manipulation.isEmpty; }
    get modifier() { return this.core.modifier; }
    get noSort() { return this.manipulation.noSort; }
    get sides() { return this.core.sides; }
    get sign() { return this.core.sign; }
    _test;
    get test() { return this._test ?? (this._test = new DiceTest(this.core.test)); }
    get hasTest() { return !this.test.isEmpty; }
    get adjustedCount() { return this.manipulation.adjustedCount; }
    get biggest() { return this.adjustedCount * this.sides + this.modifier; }
    get smallest() { return this.adjustedCount + this.modifier; }
    get max() { return this.sign === "-" ? -1 * this.smallest : this.biggest; }
    get min() { return this.sign === "-" ? -1 * this.biggest : this.smallest; }
    get hasDie() { return this.count > 0 && this.sides > 0; }
    get isEmpty() { return this.count === 0 && this.sides === 0 && this.modifier === 0; }
    quickRoll() {
        if (this.isEmpty) {
            return null;
        }
        const _constructor = this.constructor;
        const roll = _constructor.Roll.create(this);
        return roll.total;
    }
    get hasSecret() {
        return hasSecretFlag(this.description);
    }
    roll() {
        const _constructor = this.constructor;
        return _constructor.Roll.create(this);
    }
    toString(index, outputType) {
        const die = this.count && this.sides ? `${this.count}d${this.sides}` : ``, manipulation = this.manipulation.toString(), mod = this.modifier ? ` ${this.modifier}` : ``, valueTest = this.test.toString(), withoutDescription = die + manipulation + mod + valueTest;
        if (outputType === DiceOutputType.S) {
            return withoutDescription;
        }
        const sign = index && !this.isEmpty ? `${this.sign ?? "+"}` : ``;
        return `${sign} ${withoutDescription} ${this.description}`.trim();
    }
    static create(args = {}) {
        return new DicePart({
            objectType: "DicePart",
            gameType: 0,
            id: randomSnowflake(),
            count: args.count ?? 0,
            description: cleanDicePartDescription(args.description),
            manipulation: args.manipulation,
            modifier: args.modifier ?? 0,
            fixedRolls: args.fixedRolls,
            sides: args.sides ?? 0,
            sign: args.sign,
            test: args.test
        });
    }
    static fromCore(core) {
        return new DicePart(core);
    }
    static fromTokens(tokens) {
        const core = tokens.reduce(reduceTokenToDicePartCore, { description: "" });
        return DicePart.create(core);
    }
    static Roll;
}
