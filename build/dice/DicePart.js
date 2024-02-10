import { randomSnowflake } from "@rsc-utils/snowflake-utils";
import { DiceTest } from "../DiceTest.js";
import { cleanDicePartDescription } from "../cleanDicePartDescription.js";
import { hasSecretFlag } from "../internal/hasSecretFlag.js";
import { DiceManipulator } from "../manipulate/DiceManipulator.js";
import { rollDice } from "../roll/rollDice.js";
import { DiceOutputType } from "../types/DiceOutputType.js";
import { DiceBase } from "./DiceBase.js";
export class DicePart extends DiceBase {
    get count() { return this.core.count; }
    get description() { return this.core.description; }
    get fixedRolls() { return this.core.fixedRolls ?? []; }
    get initialRolls() { return this.core.initialRolls ?? []; }
    get manipulatedRolls() { return this.core.manipulatedRolls ?? []; }
    _manipulation;
    get manipulation() { return this._manipulation ?? (this._manipulation = new DiceManipulator(this.core.manipulation)); }
    get modifier() { return this.core.modifier; }
    get sides() { return this.core.sides; }
    get sign() { return this.core.sign; }
    _test;
    get test() { return this._test ?? (this._test = new DiceTest(this.core.test)); }
    get adjustedCount() { return this.manipulation.adjustedCount; }
    get biggest() { return this.adjustedCount * this.sides + this.modifier; }
    get max() { return this.sign === "-" ? -1 * this.smallest : this.biggest; }
    get maxCount() { return this.manipulatedRolls.filter(roll => roll === this.sides).length; }
    get min() { return this.sign === "-" ? -1 * this.biggest : this.smallest; }
    get minCount() { return this.manipulatedRolls.filter(roll => roll === 1).length; }
    get smallest() { return this.adjustedCount + this.modifier; }
    get total() {
        if (this.hasRolls) {
            const mod = this.modifier;
            const adjustedSum = this.manipulation.adjustedSum;
            const mult = this.sign === "-" ? -1 : 1;
            return mult * (mod + adjustedSum);
        }
        return 0;
    }
    get hasDescription() { return this.core.description.length > 0; }
    get hasDie() { return this.count > 0 && this.sides > 0; }
    get hasManipulation() { return !this.manipulation.isEmpty; }
    get hasRolls() { return this.initialRolls.length > 0; }
    get hasSecret() { return hasSecretFlag(this.description); }
    get hasTest() { return !this.test.isEmpty; }
    get isEmpty() { return this.count === 0 && this.sides === 0 && this.modifier === 0; }
    get isMax() { return this.total === this.max; }
    get isMin() { return this.total === this.min; }
    roll() {
        if (this.isEmpty) {
            return;
        }
        const rolls = this.fixedRolls.slice(0, this.count);
        if (rolls.length < this.count) {
            rolls.push(...rollDice(this.count - rolls.length, this.sides));
        }
        this.manipulation.manipulate(rolls);
        this.core.initialRolls = rolls;
        this.core.manipulatedRolls;
    }
    toDiceString(outputType, index) {
        const die = this.count && this.sides ? `${this.count}d${this.sides}` : ``, manipulation = this.manipulation.toString(), mod = this.modifier ? ` ${this.modifier}` : ``, valueTest = this.test.toString(), withoutDescription = die + manipulation + mod + valueTest;
        if (outputType === DiceOutputType.S) {
            return withoutDescription;
        }
        const sign = index && !this.isEmpty ? `${this.sign ?? "+"}` : ``;
        return `${sign} ${withoutDescription} ${this.description}`.trim();
    }
    toRollString() { return ""; }
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
            initialRolls: args.initialRolls,
            sides: args.sides ?? 0,
            sign: args.sign,
            test: args.test,
            children: undefined
        });
    }
    static fromCore(core) {
        return new DicePart(core);
    }
}
