import { isBoolean, randomSnowflake } from "@rsc-utils/core-utils";
import { isGradeFailure } from "../grade.js";
import { isDiceOutputType } from "../internal/isDiceOutputType.js";
import { tokenize } from "../internal/tokenize.js";
import { getDiceTokenParsers } from "../token/getDiceTokenParsers.js";
import { partitionDicePartTokens } from "../token/partitionDicePartTokens.js";
import { partitionDiceParts } from "../token/partitionDiceParts.js";
import { DiceCriticalMethodType } from "../types/DiceCriticalMethodType.js";
import { DiceOutputType } from "../types/DiceOutputType.js";
import { DiceSecretMethodType } from "../types/DiceSecretMethodType.js";
import { Dice } from "./Dice.js";
import { DiceBase } from "./DiceBase.js";
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
            gameType: this.GameType,
            id: randomSnowflake(),
            children: dice.map(_dice => _dice.toJSON()),
            criticalMethodType: args.criticalMethodType,
            outputType: args.outputType,
            secretMethodType: args.secretMethodType
        });
    }
    static fromCore(core) {
        return new this(core);
    }
    static parse(diceString, args) {
        const tokens = tokenize(diceString, this.getTokenParsers(), "desc");
        return this.fromTokens(tokens, args);
    }
    static fromTokens(tokens, args) {
        const partedTokens = this.partitionDicePartTokens(tokens);
        const diceParts = partedTokens.map(tokens => this.Child.Child.fromTokens(tokens));
        const partedDiceParts = this.partitionDiceParts(diceParts);
        const dice = partedDiceParts.map(diceCore => this.Child.create(diceCore));
        return this.create(dice, args);
    }
    static getTokenParsers = getDiceTokenParsers;
    static partitionDicePartTokens = partitionDicePartTokens;
    static partitionDiceParts = partitionDiceParts;
    static Child = Dice;
}
