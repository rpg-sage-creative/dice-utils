import type { ProcessStatsArgs } from "./processStats.js";
type ReplaceStatsArgs = ProcessStatsArgs & {
    /** /\{(\w+):{2}([^:}]+)(?::([^}]+))?\}/i */
    statRegex: RegExp;
    /** /^(pc|stat)?(companion|hireling|alt|familiar)?$/i */
    typeRegex: RegExp;
};
export declare function replaceStats(diceString: string, args: ReplaceStatsArgs, stack?: string[]): string;
export {};
