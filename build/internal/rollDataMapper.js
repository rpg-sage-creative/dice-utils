export function rollDataMapper(roll, index, dieSize, isFixed) {
    return {
        dieSize,
        index,
        initialValue: roll,
        isFixed,
        isMax: roll === dieSize,
        isMin: roll === 1,
        output: String(roll),
        outputValue: roll,
        sumValue: roll
    };
}
