import type { StatsCharacter, StatsCharacterManager, StatsEncounterManager } from "./types.js";
export type ProcessStatsArgs = {
    encounters?: StatsEncounterManager;
    npcs: StatsCharacterManager;
    pcs: StatsCharacterManager;
    pc?: StatsCharacter | null;
};
export declare function processStats(diceString: string, args: ProcessStatsArgs): string;
