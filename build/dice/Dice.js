import { isBoolean, randomSnowflake, sum } from "@rsc-utils/core-utils";
import { DiceTest } from "../DiceTest.js";
import { DieRollGrade, gradeRoll, gradeToEmoji } from "../grade.js";
import { cleanWhitespace } from "../internal/cleanWhitespace.js";
import { isDiceOutputType } from "../internal/isDiceOutputType.js";
import { unquoteAndDetick } from "../internal/unquoteAndDetick.js";
import { mapDicePartToRollString } from "../mapDicePartToRollString.js";
import { removeDesc } from "../removeDesc.js";
import { sumDiceParts } from "../sumDiceParts.js";
import { DiceOutputType } from "../types/DiceOutputType.js";
import { UNICODE_LEFT_ARROW } from "../types/consts.js";
import { DiceBase } from "./DiceBase.js";
import { DicePart } from "./DicePart.js";
export class Dice extends DiceBase {
    get primary() { return this.children.find(dicePart => dicePart.hasDie); }
    get max() { return sum(this.children.map(dicePart => dicePart.max)); }
    get min() { return sum(this.children.map(dicePart => dicePart.min)); }
    get test() { return this.children.find(dicePart => dicePart.hasTest)?.test ?? DiceTest.EmptyTest; }
    get grade() { return this.constructor.gradeRoll(this); }
    get total() { return sumDiceParts(this.children); }
    get hasFixed() { return this.children.some(dicePart => dicePart.fixedRolls.length); }
    get hasRolls() { return this.children.some(dicePart => dicePart.hasRolls); }
    get isD20() { return this.primary?.sides === 20; }
    get isEmpty() { return !this.children.some(dicePart => !dicePart.isEmpty); }
    get isMax() { return this.total === this.max; }
    get isMin() { return this.total === this.min; }
    toDiceString(_outputType) {
        const outputType = _outputType === DiceOutputType.S ? DiceOutputType.S : DiceOutputType.M;
        const output = this.children.map((dicePart, index) => dicePart.toDiceString(outputType, index)).join(" ");
        return cleanWhitespace(output);
    }
    _toRollString(outputType, hideRolls) {
        const xxs = this.toRollStringXXS(hideRolls);
        const desc = this.children.find(dicePart => dicePart.hasDescription)?.description;
        const isRollem = outputType === DiceOutputType.ROLLEM;
        const noDice = [DiceOutputType.L, DiceOutputType.S, DiceOutputType.XS, DiceOutputType.XXS].includes(outputType);
        const description = this.children.map((roll, index) => mapDicePartToRollString(roll, index, { hideRolls, isRollem, noDice })).join(" ");
        if (isRollem) {
            const stripped = xxs.replace(/<\/?(b|em|i|strong)>/ig, "").trim();
            const [_, emoji, total] = /^(?:(.*?)\s+)(\d+)$/.exec(stripped) ?? ["", "", stripped];
            const escapedTotal = `\` ${total} \``;
            const output = desc
                ? `${emoji} '${unquoteAndDetick(desc)}', ${escapedTotal} ${UNICODE_LEFT_ARROW} ${removeDesc(description, desc)}`
                : `${emoji} ${escapedTotal} ${UNICODE_LEFT_ARROW} ${description}`;
            return Dice.correctEscapeForEmoji(cleanWhitespace(output));
        }
        else {
            const output = desc
                ? `${xxs} \`${unquoteAndDetick(desc)}\` ${UNICODE_LEFT_ARROW} ${removeDesc(description, desc)}`
                : `${xxs} ${UNICODE_LEFT_ARROW} ${description}`;
            return Dice.correctEscapeForEmoji(cleanWhitespace(output));
        }
    }
    toRollStringXS(hideRolls) {
        const xxs = this.toRollStringXXS(hideRolls);
        const desc = this.children.find(dicePart => dicePart.hasDescription)?.description;
        const output = desc
            ? `${xxs} \`${unquoteAndDetick(desc) ?? ""}\``
            : xxs;
        return Dice.correctEscapeForEmoji(cleanWhitespace(output));
    }
    toRollStringXXS(hideRolls) {
        const gradeEmoji = this.constructor.gradeToEmoji(this.grade, this.hasTest), outputEmoji = hideRolls ? ":question:" : gradeEmoji ?? "", fixedOutput = this.hasFixed ? "f" : "", totalString = `<i><b>${this.total}${fixedOutput}</b></i>`, totalOutput = hideRolls ? `||${totalString}||` : totalString, output = `${outputEmoji} ${totalOutput}`;
        return cleanWhitespace(output);
    }
    toRollString(...args) {
        const hideRolls = args.find(isBoolean) ?? false;
        const outputType = args.find(isDiceOutputType) ?? DiceOutputType.M;
        if (outputType === DiceOutputType.XXS) {
            return this.toRollStringXXS(hideRolls);
        }
        if (outputType === DiceOutputType.XS) {
            return this.toRollStringXS(hideRolls);
        }
        return this._toRollString(outputType, hideRolls);
    }
    static create(diceParts) {
        return new this({
            objectType: "Dice",
            gameType: this.GameType,
            id: randomSnowflake(),
            children: diceParts.map(dicePart => dicePart.toJSON())
        });
    }
    static fromCore(core) {
        return new this(core);
    }
    static Child = DicePart;
    static correctEscapeForEmoji = (diceOutput) => diceOutput;
    static gradeRoll = gradeRoll;
    static gradeToEmoji = gradeToEmoji;
}
