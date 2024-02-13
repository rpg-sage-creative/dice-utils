import { toSuperscript } from "@rsc-utils/number-utils";
export function markAsBelowThreshold(value, threshold, isFixed) {
    const superF = isFixed ? "ᶠ" : "";
    return `${threshold}↥${toSuperscript(value)}${superF}`;
}
