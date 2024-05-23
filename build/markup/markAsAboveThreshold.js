import { toSuperscript } from "../internal/toSuperscript.js";
export function markAsAboveThreshold(value, threshold, isFixed) {
    const superF = isFixed ? "ᶠ" : "";
    return `${threshold}↧${toSuperscript(value)}${superF}`;
}
