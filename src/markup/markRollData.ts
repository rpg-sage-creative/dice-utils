import type { RollData } from "../types/RollData.js";
import { markAsAboveThreshold } from "./markAsAboveThreshold.js";
import { markAsBelowThreshold } from "./markAsBelowThreshold.js";
import { markAsDropped } from "./markAsDropped.js";
import { markAsExploded } from "./markAsExploded.js";
import { markAsExplosion } from "./markAsExplosion.js";
import { markAsFixed } from "./markAsFixed.js";
import { markAsMax } from "./markAsMax.js";
import { markAsMin } from "./markAsMin.js";

export function markRollData(roll: RollData): void {
	const isThreshold = roll.isAboveThreshold || roll.isBelowThreshold;
	const outputValue = isThreshold ? roll.threshold! : roll.initialValue;

	// set value and manipulation symbol
	let output = String(outputValue);
	if (isThreshold) {
		let threshold = String(roll.threshold);
		if (roll.isExploded) {
			threshold = markAsExploded(threshold);
		}else if (roll.isExplosion) {
			threshold = markAsExplosion(threshold);
		}
		if (roll.isAboveThreshold) {
			output = markAsAboveThreshold(roll.initialValue, threshold, roll.isFixed);
		}else if (roll.isBelowThreshold) {
			output = markAsBelowThreshold(roll.initialValue, threshold, roll.isFixed);
		}
	}else {
		if (roll.isFixed) {
			output = markAsFixed(output);
		}
		if (roll.isExploded) {
			output = markAsExploded(output);
		}else if (roll.isExplosion) {
			output = markAsExplosion(output);
		}
	}

	// add markup
	if (roll.isMax) {
		output = markAsMax(output);
	}else if (roll.isMin) {
		output = markAsMin(output);
	}
	if (roll.isDropped) {
		output = markAsDropped(output);
	}

	// save output
	roll.output = output;
}