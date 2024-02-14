import { HasIdCore, type IdCore } from "@rsc-utils/class-utils";
import type { Snowflake } from "@rsc-utils/snowflake-utils";
import type { TokenData } from "@rsc-utils/string-utils";
import type { reduceTokenToCore } from "../token/reduceTokenToDicePartCore.js";
import { DiceOutputType } from "../types/DiceOutputType.js";
export type TDiceBaseCore = DiceBaseCore<any, any>;
export type DiceBaseCore<ChildCoreType extends TDiceBaseCore, ObjectType extends string, GameType extends number = number> = IdCore<ObjectType, Snowflake> & {
    children: ChildCoreType extends never ? never : ChildCoreType[];
    gameType: GameType;
};
export type TDiceBase = DiceBase<any, any, any, any>;
export declare abstract class DiceBase<Core extends DiceBaseCore<any, any, GameType>, ChildType extends TDiceBase, ObjectType extends string, GameType extends number = number> extends HasIdCore<Core, ObjectType, Snowflake> {
    private _children?;
    get children(): ChildType[];
    get gameType(): GameType;
    get hasSecret(): boolean;
    get hasTest(): boolean;
    roll(): this;
    abstract toDiceString(outputType?: DiceOutputType): string;
    abstract toRollString(...args: (boolean | DiceOutputType)[]): string;
    static create(..._args: any[]): any;
    static fromCore(_core: any): any;
    static fromTokens(_tokens: TokenData[]): any;
    static reduceTokenToCore: reduceTokenToCore<any>;
    static Child: typeof DiceBase;
}
