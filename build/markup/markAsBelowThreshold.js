import { toSuperscript } from "@rsc-utils/core-utils";
export function markAsBelowThreshold(value, threshold, isFixed) {
    const superF = isFixed ? "ᶠ" : "";
    return `${threshold}↥${toSuperscript(value)}${superF}`;
}
