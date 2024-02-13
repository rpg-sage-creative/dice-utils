import { HasIdCore, type IdCore } from "@rsc-utils/class-utils";
import type { Snowflake } from "@rsc-utils/snowflake-utils";
import { DiceOutputType } from "../types/DiceOutputType.js";

export type TDiceBaseCore = DiceBaseCore<any, any>;

export type DiceBaseCore<
	ChildCoreType extends TDiceBaseCore,
	ObjectType extends string,
	GameType extends number = number
>
= IdCore<ObjectType, Snowflake>
& {
	children: ChildCoreType extends never ? never : ChildCoreType[];
	gameType: GameType;
};

export type TDiceBase = DiceBase<any, any, any, any>;

export abstract class DiceBase<
			Core extends DiceBaseCore<any, any, GameType>,
			ChildType extends TDiceBase,
			ObjectType extends string,
			GameType extends number = number
			>extends HasIdCore<Core, ObjectType, Snowflake> {

	private _children?: ChildType[];
	public get children(): ChildType[] {
		if (!this._children) {
			const fromCore = (this.constructor as typeof DiceBase).Child.fromCore;
			this._children = this.core.children.map<ChildType>(fromCore);
		}
		return this._children;
	}

	public get gameType(): GameType { return this.core.gameType; }

	public get hasSecret(): boolean { return this.children.some(child => child.hasSecret); }

	public get hasTest(): boolean { return this.children.some(child => child.hasTest); }

	public roll(): this {
		this.children.forEach(child => child.roll());
		return this;
	}

	public abstract toDiceString(outputType?: DiceOutputType): string;
	public abstract toRollString(...args: (boolean | DiceOutputType)[]): string;

	public static create(..._args: any[]): any {
		throw new TypeError("Not Implemented.");
	}

	public static fromCore(_core: any): any {
		throw new TypeError("Not Implemented.");
	}

	public static Child: typeof DiceBase; //NOSONAR
}