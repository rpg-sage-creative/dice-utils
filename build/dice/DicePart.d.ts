import { HasIdCore, type IdCore } from "@rsc-utils/class-utils";
import { type Snowflake } from "@rsc-utils/snowflake-utils";
import { DiceTest, type DiceTestData } from "../DiceTest.js";
import { DiceManipulator, type DiceManipulationData } from "../manipulate/DiceManipulator.js";
import type { DiceOperator } from "../types/DiceOperator.js";
import { DiceOutputType } from "../types/DiceOutputType.js";
import { type TokenData } from "../types/TokenData.js";
import type { DicePartRoll, TDicePartRoll } from "./DicePartRoll.js";
interface DicePartCoreBase {
    /** number of dice */
    count: number;
    /** description of dice or modifier */
    description: string;
    /** do we have: dropKeep, explode, threshold ? ? ? */
    manipulation?: DiceManipulationData[];
    /** values to use instead of rolling */
    fixedRolls?: number[];
    /** roll modifier */
    modifier: number;
    /** number of sides on the dice */
    sides: number;
    /** sign (- or +) of the dice or modifier */
    sign?: DiceOperator;
    /** target test information */
    test?: DiceTestData;
}
export type DicePartCoreArgs = Partial<DicePartCoreBase>;
export interface DicePartCore<GameType extends number = number> extends DicePartCoreBase, IdCore<"DicePart", Snowflake> {
    gameType: GameType;
}
export type TDicePart = DicePart<DicePartCore, TDicePartRoll>;
export declare class DicePart<Core extends DicePartCore<GameType>, Roll extends TDicePartRoll = TDicePartRoll, GameType extends number = number> extends HasIdCore<Core> {
    get gameType(): GameType;
    get count(): number;
    get description(): string;
    get hasDescription(): boolean;
    get fixedRolls(): number[];
    private _manipulation?;
    get manipulation(): DiceManipulator;
    get hasManipulation(): boolean;
    get modifier(): number;
    get noSort(): boolean;
    get sides(): number;
    get sign(): DiceOperator | undefined;
    private _test?;
    get test(): DiceTest;
    get hasTest(): boolean;
    get adjustedCount(): number;
    private get biggest();
    private get smallest();
    get max(): number;
    get min(): number;
    get hasDie(): boolean;
    get isEmpty(): boolean;
    /** Returns null if this.isEmpty is true, otherwise it returns the results */
    quickRoll(): number | null;
    get hasSecret(): boolean;
    roll(): Roll;
    toString(index?: number, outputType?: DiceOutputType): string;
    static create(args?: DicePartCoreArgs): TDicePart;
    static fromCore(core: DicePartCore): TDicePart;
    static fromTokens(tokens: TokenData[]): TDicePart;
    static Roll: typeof DicePartRoll;
}
export {};
