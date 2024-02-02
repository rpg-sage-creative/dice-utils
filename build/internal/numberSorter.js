export function numberSorter(a, b) {
    if (a === undefined) {
        return 1;
    }
    else if (b === undefined) {
        return -1;
    }
    if (a === null) {
        return 1;
    }
    else if (b === null) {
        return -1;
    }
    if (a < b) {
        return -1;
    }
    else if (a > b) {
        return 1;
    }
    return 0;
}
