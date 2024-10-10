let pipeRegex;
function getPipeRegex() {
    return pipeRegex ?? (pipeRegex = pipeRegex = /\|{2}[^|]+\|{2}/g);
}
export function hasPipes(value) {
    return getPipeRegex().test(value);
}
export function unpipe(value) {
    const pipeRegex = getPipeRegex();
    let hasPipes = false;
    let unpiped = value;
    while (pipeRegex.test(unpiped)) {
        hasPipes = true;
        unpiped = unpiped.replace(pipeRegex, piped => piped.slice(2, -2));
    }
    ;
    return { hasPipes, unpiped };
}
let nestedPipeRegex;
function getNestedPipeRegex() {
    return nestedPipeRegex ?? (nestedPipeRegex = /\|{2}.*?\|{2}[^|]+\|{2}.*?\|{2}/g);
}
export function cleanPipes(value) {
    const nestedRegex = getNestedPipeRegex();
    while (nestedRegex.test(value)) {
        value = value.replace(nestedRegex, outer => {
            const { unpiped } = unpipe(outer.slice(2, -2));
            return `||${unpiped}||`;
        });
    }
    return value;
}
