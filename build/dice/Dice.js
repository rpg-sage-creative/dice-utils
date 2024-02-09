import { HasIdCore } from "@rsc-utils/class-utils";
import { randomSnowflake } from "@rsc-utils/snowflake-utils";
import { cleanWhitespace } from "@rsc-utils/string-utils";
import { DiceTest } from "../DiceTest.js";
import { sum } from "../sum.js";
import { DiceOutputType } from "../types/DiceOutputType.js";
import { DicePart } from "./DicePart.js";
export class Dice extends HasIdCore {
    _diceParts;
    get diceParts() {
        if (!this._diceParts) {
            const fromCore = this.constructor.Part.fromCore;
            this._diceParts = this.core.diceParts.map(fromCore);
        }
        return this._diceParts;
    }
    get baseDicePart() { return this.diceParts.find(dicePart => dicePart.hasDie); }
    get max() { return sum(this.diceParts.map(dicePart => dicePart.max)); }
    get min() { return sum(this.diceParts.map(dicePart => dicePart.min)); }
    get test() { return this.diceParts.find(dicePart => dicePart.hasTest)?.test ?? DiceTest.EmptyTest; }
    get hasFixed() { return !!this.baseDicePart?.fixedRolls?.length; }
    get hasTest() { for (const dp of this.diceParts)
        if (dp.hasTest)
            return true; return false; }
    get isD20() { return this.baseDicePart?.sides === 20; }
    get isEmpty() { return this.diceParts.length === 0 || this.diceParts.filter(dicePart => !dicePart.isEmpty).length === 0; }
    includes(dicePartOrCore) {
        const dicePartCore = "toJSON" in dicePartOrCore ? dicePartOrCore.toJSON() : dicePartOrCore;
        return this.diceParts.find(_dicePart => _dicePart.toJSON() === dicePartCore) !== undefined;
    }
    quickRoll() {
        if (this.isEmpty) {
            return null;
        }
        const _constructor = this.constructor;
        const roll = _constructor.Roll.create(this, false);
        return roll.total;
    }
    get hasSecret() { return this.diceParts.find(dicePart => dicePart.hasSecret) !== undefined; }
    roll() {
        const _constructor = this.constructor;
        return _constructor.Roll.create(this, true);
    }
    toString(outputType) {
        const _outputType = outputType === DiceOutputType.S ? DiceOutputType.S : DiceOutputType.M;
        const output = this.diceParts.map((dicePart, index) => dicePart.toString(index, _outputType)).join(" ");
        return cleanWhitespace(output);
    }
    static create(diceParts) {
        return new Dice({
            objectType: "Dice",
            gameType: 0,
            id: randomSnowflake(),
            diceParts: diceParts.map(dicePart => dicePart.toJSON())
        });
    }
    static fromCore(core) {
        return new Dice(core);
    }
    static fromDicePartCores(dicePartCores) {
        return Dice.create(dicePartCores.map(DicePart.fromCore));
    }
    static Part = DicePart;
    static Roll;
}
