import type { TokenData } from "@rsc-utils/string-utils";
import { DiceDropKeep, type DiceDropKeepData } from "./DiceDropKeep.js";
import { type DiceExplodeData } from "./DiceExplode.js";
import { type DiceThresholdData } from "./DiceThreshold.js";
export type DiceManipulationData = {
    dropKeep?: DiceDropKeepData;
    explode?: DiceExplodeData;
    noSort?: boolean;
    threshold?: DiceThresholdData;
};
export type HasDiceManipulationData = {
    manipulation?: DiceManipulationData[];
};
export declare function appendManipulationToCore(core: HasDiceManipulationData, token: TokenData, index: number, tokens: TokenData[]): boolean;
export declare class DiceManipulator {
    protected data?: DiceManipulationData[] | undefined;
    constructor(data?: DiceManipulationData[] | undefined);
    get adjustedCount(): number;
    get adjustedRolls(): number[];
    get adjustedSum(): number;
    get dropKeep(): DiceDropKeep;
    get hasDropKeep(): boolean;
    get hasRolls(): boolean;
    get isEmpty(): boolean;
    private _rolls?;
    get rolls(): number[];
    manipulate(rolls: number[]): void;
    get noSort(): boolean;
    toJSON(): DiceManipulationData[] | undefined;
    toString(): string;
}
