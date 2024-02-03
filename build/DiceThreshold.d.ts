export declare enum DiceThresholdType {
    None = 0,
    LowestThreshold = 1,
    HighestThreshold = 2
}
/** The information about how manipulate rolls to meet the threshold. */
export type DiceThresholdData = {
    /** the fundamental action */
    type: DiceThresholdType;
    /** the value used for the threshold */
    value: number;
    /** a human readable alternative for output */
    alias?: string;
};
