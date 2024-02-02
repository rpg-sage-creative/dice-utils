import { assert, runTests, startAsserting } from "@rsc-utils/test-utils";
import { DieRollGrade, isGradeSuccess, isGradeFailure, increaseGrade, decreaseGrade, gradeToEmoji, gradeRoll, DiceTestType } from "../build/index.js";

runTests(async function testGrade() {
	const cf = DieRollGrade.CriticalFailure;
	const f = DieRollGrade.Failure;
	const s = DieRollGrade.Success;
	const cs = DieRollGrade.CriticalSuccess;
	const u = DieRollGrade.Unknown;

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
	assert(f, gradeRoll, { dice:{ test:{type:DiceTestType.Equal, value:10} }, total:0});
	assert(s, gradeRoll, { dice:{ test:{type:DiceTestType.Equal, value:10} }, total:10});

	assert(f, gradeRoll, { dice:{ test:{type:DiceTestType.GreaterThan, value:10} }, total:0});
	assert(s, gradeRoll, { dice:{ test:{type:DiceTestType.GreaterThan, value:10} }, total:20});

	assert(f, gradeRoll, { dice:{ test:{type:DiceTestType.GreaterThanOrEqual, value:10} }, total:0});
	assert(s, gradeRoll, { dice:{ test:{type:DiceTestType.GreaterThanOrEqual, value:10} }, total:10});
	assert(s, gradeRoll, { dice:{ test:{type:DiceTestType.GreaterThanOrEqual, value:10} }, total:20});

	assert(s, gradeRoll, { dice:{ test:{type:DiceTestType.LessThan, value:10} }, total:0});
	assert(f, gradeRoll, { dice:{ test:{type:DiceTestType.LessThan, value:10} }, total:20});

	assert(s, gradeRoll, { dice:{ test:{type:DiceTestType.LessThanOrEqual, value:10} }, total:0});
	assert(s, gradeRoll, { dice:{ test:{type:DiceTestType.LessThanOrEqual, value:10} }, total:10});
	assert(f, gradeRoll, { dice:{ test:{type:DiceTestType.LessThanOrEqual, value:10} }, total:20});

	assert(u, gradeRoll, { dice:{ }, total:11});
}, true);