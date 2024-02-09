import { HasIdCore } from "@rsc-utils/class-utils";
import { randomSnowflake } from "@rsc-utils/snowflake-utils";
import { cleanWhitespace, dequote } from "@rsc-utils/string-utils";
import { detick } from "../detick.js";
import { gradeRoll, gradeToEmoji } from "../grade.js";
import { mapDicePartRollToString } from "../mapDicePartRollToString.js";
import { removeDesc } from "../removeDesc.js";
import { sumDicePartRolls } from "../sumDicePartRolls.js";
import { DiceOutputType } from "../types/DiceOutputType.js";
import { UNICODE_LEFT_ARROW } from "../types/consts.js";
import { Dice } from "./Dice.js";
export class DiceRoll extends HasIdCore {
    get grade() { return gradeRoll(this); }
    get total() { return sumDicePartRolls(this.rolls); }
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
    _rolls;
    get rolls() {
        if (!this._rolls) {
            const fromCore = this.constructor.Dice.Part.Roll.fromCore;
            this._rolls = this.core.rolls.map(fromCore);
        }
        return this._rolls;
    }
    _toString(outputType, hideRolls) {
        const xxs = this.toStringXXS(hideRolls);
        const desc = this.dice.diceParts.find(dp => dp.hasDescription)?.description;
        const isRollem = outputType === DiceOutputType.ROLLEM;
        const noDice = [DiceOutputType.L, DiceOutputType.S, DiceOutputType.XS, DiceOutputType.XXS].includes(outputType);
        const description = this.rolls.map((roll, index) => mapDicePartRollToString(roll, index, { hideRolls, isRollem, noDice })).join(" ");
        if (isRollem) {
            const stripped = xxs.replace(/<\/?(b|em|i|strong)>/ig, "").trim();
            const [_, emoji, total] = stripped.match(/^(?:(.*?)\s+)(\d+)$/) ?? ["", "", stripped];
            const escapedTotal = `\` ${total} \``;
            const output = desc
                ? `${emoji} '${detick(dequote(desc))}', ${escapedTotal} ${UNICODE_LEFT_ARROW} ${removeDesc(description, desc)}`
                : `${emoji} ${escapedTotal} ${UNICODE_LEFT_ARROW} ${description}`;
            return cleanWhitespace(output);
        }
        else {
            const output = desc
                ? `${xxs} \`${detick(dequote(desc))}\` ${UNICODE_LEFT_ARROW} ${removeDesc(description, desc)}`
                : `${xxs} ${UNICODE_LEFT_ARROW} ${description}`;
            return cleanWhitespace(output);
        }
    }
    toStringXS(hideRolls) {
        const xxs = this.toStringXXS(hideRolls);
        const desc = this.dice.diceParts.find(dp => dp.hasDescription)?.description;
        const output = desc
            ? `${xxs} \`${detick(dequote(desc)) ?? ""}\``
            : xxs;
        return cleanWhitespace(output);
    }
    toStringXXS(hideRolls) {
        const gradeEmoji = gradeToEmoji(this.grade), outputEmoji = hideRolls ? ":question:" : gradeEmoji ?? "", fixedOutput = this.dice.hasFixed ? "f" : "", totalString = `<i><b>${this.total}${fixedOutput}</b></i>`, totalOutput = hideRolls ? `||${totalString}||` : totalString, output = `${outputEmoji} ${totalOutput}`;
        return cleanWhitespace(output);
    }
    toString(...args) {
        const hideRolls = args.find(arg => arg === true || arg === false) ?? false;
        const outputType = args.find(arg => !!(DiceOutputType[arg] ?? false)) ?? DiceOutputType.M;
        if (outputType === DiceOutputType.XXS) {
            return this.toStringXXS(hideRolls);
        }
        if (outputType === DiceOutputType.XS) {
            return this.toStringXS(hideRolls);
        }
        return this._toString(outputType, hideRolls);
    }
    static create(_dice, uuid) {
        const core = {
            objectType: "DiceRoll",
            gameType: 0,
            id: uuid ? randomSnowflake() : null,
            dice: _dice.toJSON(),
            rolls: _dice.diceParts.map(dicePart => dicePart.roll().toJSON())
        };
        return new DiceRoll(core);
    }
    static fromCore(core) {
        return new DiceRoll(core);
    }
    static Dice = Dice;
}
Dice.Roll = DiceRoll;
