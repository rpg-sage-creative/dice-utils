export function cleanDicePartDescription(description) {
    const replaced = (description ?? "").replace(/[;,]\s*$/, "");
    return replaced.replace(/\s+/g, " ");
}
