export function sumDiceParts(diceParts) {
    return diceParts.reduce((value, dicePart) => {
        switch (dicePart.sign) {
            case "-": return value + dicePart.total;
            case "*": return value * dicePart.total;
            case "/": return value / dicePart.total;
            default: return value + dicePart.total;
        }
    }, 0);
}
