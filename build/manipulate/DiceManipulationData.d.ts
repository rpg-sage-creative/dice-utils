import type { DiceDropKeep } from "./DiceDropKeep.js";
import type { DiceExplode } from "./DiceExplode.js";
import type { DiceThreshold } from "./DiceThreshold.js";
export type DiceManipulationData = {
    dropKeep?: DiceDropKeep;
    explode?: DiceExplode;
    noSort?: boolean;
    threshold?: DiceThreshold;
};
