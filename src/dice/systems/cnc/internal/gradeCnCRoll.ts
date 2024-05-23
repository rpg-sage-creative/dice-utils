import { DieRollGrade } from "../../../../grade.js";

/** Reusable function for grading a single die roll. */
function gradeCnCDie(value: number, vs: number): DieRollGrade {
	if (value === 12) {
		return DieRollGrade.CriticalSuccess;
	}else if (value >= vs) {
		return DieRollGrade.Success;
	}else if (value > 1) {
		return DieRollGrade.Failure;
	}else if (value === 1) {
		return DieRollGrade.CriticalFailure;
	}else {
		return DieRollGrade.Unknown;
	}
}

/**
 * Grades the entire roll by grading each roll based on if it was an exploded roll or not.
 * Returns the grade along with the different counts.
 */
export function gradeCnCRoll(baseValues: number[], explodedValues: number[], vs: number): [DieRollGrade, number[]] {
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
		const grade = gradeCnCDie(value, vs);

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
		const grade = gradeCnCDie(value, vs);
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