export function getTokenParsers() {
    return {
        dice: /\s*(\d+)?\s*d\s*(12)/i,
        target: /(vs)\s*(\d+|\|\|\d+\|\|)/i
    };
}
