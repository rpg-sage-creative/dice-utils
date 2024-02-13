import { DiceTestType } from "../DiceTest.js";
import { rollDataMapper } from "../internal/rollDataMapper.js";
import { rollDie } from "../roll/rollDie.js";
import { DiceManipulation } from "./DiceManipulation.js";
export class DiceExplode extends DiceManipulation {
    get alias() { return this.data?.alias ?? ""; }
    get type() { return this.data?.type ?? DiceTestType.None; }
    get value() { return this.data?.value ?? 0; }
    manipulateRolls(rolls) {
        const explosionRolls = [];
        if (!this.isEmpty) {
            const rollsToCheck = rolls.slice();
            while (rollsToCheck.length) {
                const rollToCheck = rollsToCheck.shift();
                if (this.shouldExplode(rollToCheck.outputValue)) {
                    rollToCheck.isExploded = true;
                    const explosionValue = rollDie(rollToCheck.dieSize);
                    const explosionIndex = rolls.length + explosionRolls.length;
                    const explosionRoll = rollDataMapper(explosionValue, explosionIndex, rollToCheck.dieSize, false);
                    explosionRoll.isExplosion = true;
                    explosionRolls.push(explosionRoll);
                    rollsToCheck.push(explosionRoll);
                }
            }
        }
        return explosionRolls;
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
        const rollData = dieValues.map((roll, index) => rollDataMapper(roll, index, dieSize, false));
        const explodedData = exploder.manipulateRolls(rollData);
        return explodedData.map(exploded => exploded.outputValue);
    }
}
