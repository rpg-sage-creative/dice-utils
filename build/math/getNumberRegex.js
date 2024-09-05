export function getNumberRegex(options) {
    const capture = options?.capture ? "" : "?:";
    return new RegExp(`(${capture}[+-]?\\d+(?:\\.\\d+)?)`);
}
