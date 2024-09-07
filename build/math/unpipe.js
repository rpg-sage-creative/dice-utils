export function unpipe(value) {
    const pipeRegex = /\|{2}[^|]+\|{2}/g;
    const hasPipes = pipeRegex.test(value);
    const unpiped = hasPipes
        ? value.replace(pipeRegex, piped => piped.slice(2, -2))
        : value;
    return { hasPipes, unpiped };
}
