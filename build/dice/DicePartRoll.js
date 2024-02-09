import { randomSnowflake } from "@rsc-utils/snowflake-utils";
import { DiceRollManipulator } from "../manipulate/DiceManipulator.js";
import { rollDice } from "../rollDice.js";
import { DicePart } from "./DicePart.js";
export class DicePartRoll {
    core;
    get objectType() { return this.core.objectType; }
    toJSON() { return this.core; }
    get id() { return this.core.id; }
    constructor(core) {
        this.core = core;
    }
    get gameType() { return this.core.gameType; }
    get sign() {
        return this.dice.sign;
    }
    _manipulation;
    get manipulation() { return this._manipulation ?? (this._manipulation = new DiceRollManipulator(this.dice.manipulation, this.rolls)); }
    get hasManipulation() { return !this.manipulation.isEmpty; }
    get total() {
        const mod = this.dice.modifier;
        const adjustedSum = this.manipulation.adjustedSum;
        const mult = this.sign === "-" ? -1 : 1;
        return mult * (mod + adjustedSum);
    }
    get isMax() { return this.total === this.dice.max; }
    get isMin() { return this.total === this.dice.min; }
    _dice;
    get dice() {
        if (!this._dice) {
            const fromCore = this.constructor.Dice.fromCore;
            this._dice = fromCore(this.core.dice);
        }
        return this._dice;
    }
    get hasSecret() {
        return this.dice.hasSecret;
    }
    get rolls() {
        return this.core.rolls.slice();
    }
    get minCount() {
        return this.core.rolls.filter(roll => roll === 1).length;
    }
    get maxCount() {
        return this.core.rolls.filter(roll => roll === this.dice.sides).length;
    }
    static _createCore(dicePart, gameType = 0) {
        const rolls = dicePart.fixedRolls.slice(0, dicePart.count);
        if (rolls.length < dicePart.count) {
            rolls.push(...rollDice(dicePart.count - rolls.length, dicePart.sides));
        }
        return {
            objectType: "DicePartRoll",
            gameType,
            id: randomSnowflake(),
            dice: dicePart.toJSON(),
            rolls
        };
    }
    static create(dicePart) {
        return new DicePartRoll(this._createCore(dicePart));
    }
    static fromCore(core) {
        return new DicePartRoll(core);
    }
    static Dice = DicePart;
}
DicePart.Roll = DicePartRoll;
