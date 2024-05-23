export function isMath(value) {
    const MATH_REGEX = /\[[ \d+\-*/()^]+[+\-*/^]+[ \d+\-*/()^]+\]/i;
    return MATH_REGEX.test(value);
}
