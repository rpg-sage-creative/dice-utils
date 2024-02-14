import { randomSnowflake } from "@rsc-utils/snowflake-utils";
import { DiceTest } from "../DiceTest.js";
import { cleanDicePartDescription } from "../cleanDicePartDescription.js";
import { hasSecretFlag } from "../internal/hasSecretFlag.js";
import { DiceDropKeep } from "../manipulate/DiceDropKeep.js";
import { DiceExplode } from "../manipulate/DiceExplode.js";
import { DiceThreshold } from "../manipulate/DiceThreshold.js";
import { rollDicePart } from "../roll/rollDicePart.js";
import { DiceOutputType } from "../types/DiceOutputType.js";
import { DiceBase } from "./DiceBase.js";
import { reduceTokenToDicePartCore } from "../token/reduceTokenToDicePartCore.js";
export class DicePart extends DiceBase {
    constructor(core) {
        super(core);
        core.manipulation?.forEach(m => {
            if (m.dropKeep) {
                m.dropKeep = new DiceDropKeep(m.dropKeep);
            }
            else if (m.explode) {
                m.explode = new DiceExplode(m.explode);
            }
            else if (m.threshold) {
                m.threshold = new DiceThreshold(m.threshold);
            }
        });
    }
    get count() { return this.core.count ?? 0; }
    get description() { return this.core.description ?? ""; }
    get fixedRolls() { return this.core.fixedRolls ?? []; }
    get manipulation() { return this.core.manipulation ?? []; }
    get modifier() { return this.core.modifier ?? 0; }
    get sides() { return this.core.sides ?? 0; }
    get sign() { return this.core.sign; }
    get sortedRollData() { return this.core.sortedRollData; }
    ;
    _test;
    get test() { return this._test ?? (this._test = new DiceTest(this.core.test)); }
    get hasDescription() { return this.description.length > 0; }
    get hasDie() { return this.count > 0 && this.sides > 0; }
    get hasManipulation() { return this.manipulation.length > 0; }
    get hasRolls() { return !!this.sortedRollData; }
    get hasSecret() { return hasSecretFlag(this.description); }
    get hasTest() { return !this.test.isEmpty; }
    get isEmpty() { return this.count === 0 && this.sides === 0 && this.modifier === 0; }
    get isMax() { return this.total === this.max; }
    get isMin() { return this.total === this.min; }
    get biggest() { return (this.hasRolls ? this.rollCount : this.count) * this.sides + this.modifier; }
    get smallest() { return (this.hasRolls ? this.rollCount : this.count) + this.modifier; }
    get max() { return this.sign === "-" ? -1 * this.smallest : this.biggest; }
    get maxCount() { return this.rollsByIndex.filter(roll => !roll.isDropped && roll.isMax).length; }
    get min() { return this.sign === "-" ? -1 * this.biggest : this.smallest; }
    get minCount() { return this.rollsByIndex.filter(roll => !roll.isDropped && roll.isMin).length; }
    get rollCount() { return this.sortedRollData?.count ?? 0; }
    get rollSum() { return this.sortedRollData?.sum ?? 0; }
    get rollsByIndex() { return this.sortedRollData?.byIndex ?? []; }
    get rollsByValue() { return this.sortedRollData?.byValue ?? []; }
    get total() {
        const mod = this.modifier;
        const rollSum = this.rollSum;
        const mult = this.sign === "-" ? -1 : 1;
        return mult * (mod + rollSum);
    }
    roll() {
        if (!this.isEmpty || !this.hasRolls) {
            this.core.sortedRollData = rollDicePart(this);
        }
        return this;
    }
    toDiceString(outputType, index) {
        const fixed = this.fixedRolls.length ? `(${this.fixedRolls})` : ``;
        const die = this.count && this.sides ? `${fixed}${this.count}d${this.sides}` : ``;
        const manipulation = this.toManipulationString(" ");
        const mod = this.modifier ? ` ${this.modifier}` : ``;
        const valueTest = this.test.toString();
        const withoutDescription = die + manipulation + mod + valueTest;
        if (outputType === DiceOutputType.S) {
            return withoutDescription;
        }
        const sign = index && !this.isEmpty ? `${this.sign ?? "+"}` : ``;
        return `${sign} ${withoutDescription} ${this.description}`.trim();
    }
    toManipulationString(leftPad, rightPad) {
        return this.manipulation?.map(m => {
            return m.dropKeep?.toString(leftPad, rightPad)
                ?? m.explode?.toString(leftPad, rightPad)
                ?? m.threshold?.toString(leftPad, rightPad);
        })
            .filter(s => s?.length)
            .join("")
            ?? "";
    }
    toRollString() { return ""; }
    static create(args = {}) {
        return this.fromCore({
            objectType: "DicePart",
            gameType: this.GameType,
            id: randomSnowflake(),
            count: args.count ?? 0,
            description: cleanDicePartDescription(args.description),
            manipulation: args.manipulation,
            modifier: args.modifier ?? 0,
            fixedRolls: args.fixedRolls,
            sides: args.sides ?? 0,
            sign: args.sign,
            sortedRollData: args.sortedRollData,
            test: args.test,
            children: undefined
        });
    }
    static fromCore(core) {
        return new this(core);
    }
    static fromTokens(tokens) {
        const core = tokens.reduce(this.reduceTokenToCore, { description: "" });
        return this.create(core);
    }
    static reduceTokenToCore = reduceTokenToDicePartCore;
}
