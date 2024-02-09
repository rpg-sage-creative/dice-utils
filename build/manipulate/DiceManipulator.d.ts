import type { TokenData } from "../types/TokenData.js";
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
    protected diceCount: number;
    constructor(data?: DiceManipulationData[] | undefined, diceCount?: number);
    get adjustedCount(): number;
    get isEmpty(): boolean;
    get dropKeep(): DiceDropKeep;
    get hasDropKeep(): boolean;
    get noSort(): boolean;
    toJSON(): DiceManipulationData[] | undefined;
    toString(): string;
}
export declare class DiceRollManipulator {
    manipulator: DiceManipulator;
    rolls: number[];
    constructor(manipulator: DiceManipulator, rolls: number[]);
    get isEmpty(): boolean;
    get adjustedCount(): number;
    get adjustedRolls(): number[];
    get adjustedSum(): number;
}
