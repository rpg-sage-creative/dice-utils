import { assert, runTests, startAsserting } from "@rsc-utils/core-utils";
import { Dice, DiceGroup, DiceTestType, DieRollGrade, decreaseGrade, gradeRoll, gradeToEmoji, increaseGrade, isGradeCritical, isGradeFailure, isGradeSuccess } from "../build/index.js";

runTests(async function test_Grade() {
	const cf = DieRollGrade.CriticalFailure;
	const f = DieRollGrade.Failure;
	const s = DieRollGrade.Success;
	const cs = DieRollGrade.CriticalSuccess;
	const u = DieRollGrade.Unknown;

	startAsserting("isGradeCritical");
	assert(true, isGradeCritical, cf);
	assert(false, isGradeCritical, f);
	assert(false, isGradeCritical, s);
	assert(true, isGradeCritical, cs);
	assert(false, isGradeCritical, u);

	startAsserting("isGradeFailure");
	assert(true, isGradeFailure, cf);
	assert(true, isGradeFailure, f);
	assert(false, isGradeFailure, s);
	assert(false, isGradeFailure, cs);
	assert(false, isGradeFailure, u);

	startAsserting("isGradeSuccess");
	assert(false, isGradeSuccess, cf);
	assert(false, isGradeSuccess, f);
	assert(true, isGradeSuccess, s);
	assert(true, isGradeSuccess, cs);
	assert(false, isGradeSuccess, u);

	startAsserting("decreaseGrade");
	assert(cf, decreaseGrade, cf);
	assert(cf, decreaseGrade, f);
	assert(f, decreaseGrade, s);
	assert(s, decreaseGrade, cs);
	assert(u, decreaseGrade, u);

	startAsserting("increaseGrade");
	assert(f, increaseGrade, cf);
	assert(s, increaseGrade, f);
	assert(cs, increaseGrade, s);
	assert(cs, increaseGrade, cs);
	assert(u, increaseGrade, u);

	startAsserting("gradeToEmoji");
	assert("[critical-failure]", gradeToEmoji, cf);
	assert("[failure]", gradeToEmoji, f);
	assert("[success]", gradeToEmoji, s);
	assert("[critical-success]", gradeToEmoji, cs);
	assert(undefined, gradeToEmoji, u);

	startAsserting("gradeRoll");
	const makeGradeRollDice = (test, roll) => {
		return DiceGroup.parse(`(${roll})1d20${test}10`).roll().primary;
	};

	assert(f, gradeRoll, makeGradeRollDice("=", 1));
	assert(s, gradeRoll, makeGradeRollDice("=", 10));

	assert(f, gradeRoll, makeGradeRollDice(">", 1));
	assert(s, gradeRoll, makeGradeRollDice(">", 20));

	assert(f, gradeRoll, makeGradeRollDice(">=", 1));
	assert(s, gradeRoll, makeGradeRollDice(">=", 10));
	assert(s, gradeRoll, makeGradeRollDice(">=", 20));

	assert(s, gradeRoll, makeGradeRollDice("<", 1));
	assert(f, gradeRoll, makeGradeRollDice("<", 20));

	assert(s, gradeRoll, makeGradeRollDice("<=", 1));
	assert(s, gradeRoll, makeGradeRollDice("<=", 10));
	assert(f, gradeRoll, makeGradeRollDice("<=", 20));

	assert(u, gradeRoll, makeGradeRollDice(0, 11));
}, true);