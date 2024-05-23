import { DieRollGrade } from "../../../grade.js";
import { gradeDie } from "./gradeDie.js";

export function gradeRoll(baseValues: number[], explodedValues: number[], vs: number): [DieRollGrade, number[]] {
	const values = [
		/** total successes */
		0,
		/** CriticalFailures */
		0,
		/** Failures */
		0,
		/** Successes */
		0,
		/** CriticalSuccesses */
		0,
		/** total exploded successes */
		0
	];

	// base values can be success or failure
	baseValues.forEach(value => {
		const grade = gradeDie(value, vs);

		// increment count for grade
		values[grade]++;

		// update total successes
		switch(grade) {
			case DieRollGrade.CriticalSuccess:
			case DieRollGrade.Success:
				values[0] += 1;
				break;
			case DieRollGrade.CriticalFailure:
				values[0] -= 1;
				break;
		}
	});

	// exploded values are only crit success or success
	explodedValues.forEach(value => {
		const grade = gradeDie(value, vs);
		if (grade === DieRollGrade.CriticalSuccess) {
			// increment count for grade
			values[DieRollGrade.CriticalSuccess]++;
			// update total exploded successes
			values[5] += 2;
		}else {
			// increment count for grade
			values[DieRollGrade.Success]++;
			// update total exploded successes
			values[5] += 1;
		}
	});

	const totalSuccesses = values[0] + values[5];
	let grade: DieRollGrade;
	if (totalSuccesses === 0) {
		grade = DieRollGrade.Failure;
	}else if (totalSuccesses < 0) {
		grade = DieRollGrade.CriticalFailure;
	}else {
		grade = DieRollGrade.Success;
	}

	return [grade, values];
}