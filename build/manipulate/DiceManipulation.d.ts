import type { RollData } from "../types/RollData.js";
export declare abstract class DiceManipulation<DataType> {
    protected data?: DataType | undefined;
    constructor(data?: DataType | undefined);
    get isEmpty(): boolean;
    abstract get type(): number;
    abstract get value(): number;
    abstract manipulateRolls(rollData: RollData[]): void;
    toJSON(): DataType | undefined;
    abstract toString(leftPad?: string, rightPad?: string): string;
}
