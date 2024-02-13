export type RollData = {
    dieSize: number;
    /** The original index of the roll (order it was rolled in) */
    index: number;
    /** The value rolled. */
    initialValue: number;
    isAboveThreshold?: boolean;
    isBelowThreshold?: boolean;
    /** Has the roll been dropped. */
    isDropped?: boolean;
    /** Is this roll causing an explosion. */
    isExploded?: boolean;
    /** Is this roll the result of an explosion. */
    isExplosion?: boolean;
    /** Is the roll/result fixed. */
    isFixed?: boolean;
    /** Is the roll the min value. */
    isMin?: boolean;
    /** Is the roll the max value. */
    isMax?: boolean;
    /** String output to be marked as: min, max, dropped, etc. */
    output: string;
    /** The value after manipulation (such as threshold) */
    outputValue: number;
    /** Value used to determine sum (usually 0 for dropped) */
    sumValue: number;
    /** The threshold checked against. */
    threshold?: number;
};
