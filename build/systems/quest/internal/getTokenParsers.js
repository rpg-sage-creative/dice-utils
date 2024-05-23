export function getTokenParsers() {
    return {
        dice: /\s*(1)?\s*d\s*(20)/i,
        target: /(vs)\s*(\d+|\|\|\d+\|\|)/i
    };
}
