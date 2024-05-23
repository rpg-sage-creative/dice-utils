import type { ProcessStatsArgs } from "./processStats.js";
type ReplaceStatsArgs = ProcessStatsArgs & {
    statRegex: RegExp;
    typeRegex: RegExp;
};
export declare function replaceStats(diceString: string, args: ReplaceStatsArgs, stack?: string[]): string;
export {};
