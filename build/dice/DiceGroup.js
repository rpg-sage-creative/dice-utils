import { randomSnowflake } from "@rsc-utils/snowflake-utils";
import { isGradeFailure } from "../grade.js";
import { isBoolean } from "../internal/isBoolean.js";
import { isDiceOutputType } from "../internal/isDiceOutputType.js";
import { DiceOutputType } from "../types/DiceOutputType.js";
import { Dice } from "./Dice.js";
import { DiceBase } from "./DiceBase.js";
import { tokenize } from "@rsc-utils/string-utils";
import { getDiceTokenParsers } from "../token/getDiceTokenParsers.js";
import { tokensToDiceGroup } from "../token/tokensToDiceGroup.js";
export class DiceGroup extends DiceBase {
    get criticalMethodType() { return this.core.criticalMethodType; }
    get outputType() { return this.core.outputType; }
    get primary() { return this.children.find(child => child.primary); }
    get secretMethodType() { return this.core.secretMethodType; }
    toDiceString(outputType) {
        return `[${this.children.map(dice => dice.toDiceString(outputType)).join("; ")}]`;
    }
    toRollString(...args) {
        const hideRolls = args.find(isBoolean) ?? false;
        const outputType = this.outputType ?? args.find(isDiceOutputType) ?? DiceOutputType.M;
        const joiner = outputType < DiceOutputType.L ? "; " : "\n";
        const output = [];
        for (const dice of this.children) {
            output.push(dice.toRollString(outputType, hideRolls));
            const grade = dice.grade;
            if (isGradeFailure(grade)) {
                break;
            }
        }
        return output.join(joiner);
    }
    static create(dice, args = {}) {
        return new this({
            objectType: "DiceGroup",
            gameType: 0,
            id: randomSnowflake(),
            children: dice.map(dice => dice.toJSON()),
            criticalMethodType: args.criticalMethodType,
            outputType: args.outputType,
            secretMethodType: args.secretMethodType
        });
    }
    static fromCore(core) {
        return new this(core);
    }
    static parse(diceString, outputType) {
        const tokens = tokenize(diceString, getDiceTokenParsers(), "desc");
        return tokensToDiceGroup(tokens, this, { outputType });
    }
    static Child = Dice;
}
