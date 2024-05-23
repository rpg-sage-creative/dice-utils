export function toSuperscript(value) {
    const period = ".";
    const superPeriod = "\u22C5";
    const superNumbers = ["⁰", "¹", "²", "³", "⁴", "⁵", "⁶", "⁷", "⁸", "⁹"];
    return String(value)
        .split("")
        .map(char => char === period ? superPeriod : superNumbers[+char])
        .join("");
}
