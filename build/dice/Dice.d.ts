import { HasIdCore, type IdCore } from "@rsc-utils/class-utils";
import { DiceTest } from "../DiceTest.js";
import { DiceOutputType } from "../types/DiceOutputType.js";
import { DicePart, type DicePartCore, type TDicePart } from "./DicePart.js";
import type { DiceRoll, TDiceRoll } from "./DiceRoll.js";
export interface DiceCore<GameType extends number = number> extends IdCore<"Dice"> {
    diceParts: DicePartCore[];
    gameType: GameType;
}
export type TDice = Dice<DiceCore, TDicePart, TDiceRoll>;
export declare class Dice<T extends DiceCore, U extends TDicePart, V extends TDiceRoll> extends HasIdCore<T> {
    private _diceParts?;
    get diceParts(): U[];
    get baseDicePart(): U | undefined;
    get max(): number;
    get min(): number;
    get test(): DiceTest;
    get hasFixed(): boolean;
    get hasTest(): boolean;
    get isD20(): boolean;
    get isEmpty(): boolean;
    includes(dicePartOrCore: TDicePart | DicePartCore): boolean;
    /** Returns null if this.isEmpty is true, otherwise it returns the results */
    quickRoll(): number | null;
    get hasSecret(): boolean;
    roll(): V;
    toString(outputType?: DiceOutputType): string;
    static create(diceParts: TDicePart[]): TDice;
    static fromCore(core: DiceCore): TDice;
    static fromDicePartCores(dicePartCores: DicePartCore[]): TDice;
    /** Returns null if diceString can't be parsed, otherwise it returns the results */
    static Part: typeof DicePart;
    static Roll: typeof DiceRoll;
}
