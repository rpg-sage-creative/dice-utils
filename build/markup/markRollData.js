import { markAsAboveThreshold } from "./markAsAboveThreshold.js";
import { markAsBelowThreshold } from "./markAsBelowThreshold.js";
import { markAsDropped } from "./markAsDropped.js";
import { markAsExploded } from "./markAsExploded.js";
import { markAsExplosion } from "./markAsExplosion.js";
import { markAsFixed } from "./markAsFixed.js";
import { markAsMax } from "./markAsMax.js";
import { markAsMin } from "./markAsMin.js";
export function markRollData(rollData) {
    const hasThreshold = !!rollData.isAboveThreshold || !!rollData.isBelowThreshold;
    let text = String(rollData.threshold ?? rollData.value);
    if (rollData.isFixed && !hasThreshold) {
        text = markAsFixed(text);
    }
    if (rollData.isExploded) {
        text = markAsExploded(text);
    }
    if (rollData.isExplosion) {
        text = markAsExplosion(text);
    }
    if (rollData.isAboveThreshold) {
        text = markAsAboveThreshold(rollData.value, text, rollData.isFixed);
    }
    else if (rollData.isBelowThreshold) {
        text = markAsBelowThreshold(rollData.value, text, rollData.isFixed);
    }
    if (rollData.isMax) {
        text = markAsMax(text);
    }
    else if (rollData.isMin) {
        text = markAsMin(text);
    }
    if (rollData.isDropped) {
        text = markAsDropped(text);
    }
    rollData.text = text;
}
