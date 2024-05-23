import { toSuperscript } from "../internal/toSuperscript.js";
export function markAsBelowThreshold(value, threshold, isFixed) {
    const superF = isFixed ? "ᶠ" : "";
    return `${threshold}↥${toSuperscript(value)}${superF}`;
}
