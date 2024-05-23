import type { Snowflake } from "discord.js";
import type { TokenData } from "../internal/tokenize.js";
import type { DiceOutputType } from "../types/DiceOutputType.js";
export type TDiceBaseCore = DiceBaseCore<any, any>;
export type DiceBaseCore<ChildCoreType extends TDiceBaseCore, ObjectType extends string, GameType extends number = number> = {
    children: ChildCoreType extends never ? never : ChildCoreType[];
    gameType: GameType;
    id: Snowflake;
    objectType: ObjectType;
};
export type TDiceBase = DiceBase<any, any, any, any>;
export declare abstract class DiceBase<Core extends DiceBaseCore<any, any, GameType>, ChildType extends TDiceBase, ObjectType extends string, GameType extends number = number> {
    protected core: Core;
    constructor(core: Core);
    private _children?;
    get children(): ChildType[];
    get gameType(): GameType;
    get hasSecret(): boolean;
    get hasTest(): boolean;
    /** The unique identifier for this object. */
    get id(): Snowflake;
    /** The type of data that is represented. Often the Class that the Core is for. */
    get objectType(): ObjectType;
    roll(): this;
    abstract toDiceString(outputType?: DiceOutputType): string;
    abstract toRollString(...args: (boolean | DiceOutputType)[]): string;
    /** Returns this object's core. */
    toJSON(): Core;
    static create(..._args: any[]): any;
    static fromCore(_core: any): any;
    static fromTokens(_tokens: TokenData[], ..._args: any[]): any;
    static Child: typeof DiceBase;
    static GameType: number;
}
