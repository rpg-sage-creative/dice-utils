import { debug } from "@rsc-utils/console-utils";
import { assert, runTests, startAsserting } from "@rsc-utils/test-utils";
import { Dice, DiceRoll, DieRollGrade, isGradeSuccess, isGradeFailure, increaseGrade, decreaseGrade, gradeToEmoji, gradeRoll, DiceTestType } from "../build/index.js";

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
	const makeGradeRollDiceRoll = (testType, roll, dicePart = {count:1,sides:20,modifier:0,test:{type:testType,value:10}}) => new DiceRoll({
		objectType:"DiceRoll",
		gameType:0,
		id:"1205381305760485376",
		dice:{diceParts:[dicePart]},
		rolls:[{objectType:"DicePartRoll",gameType:0,id:"1205381305764679681",dice:dicePart,rolls:[roll]}]
	});

	assert(f, gradeRoll, makeGradeRollDiceRoll(DiceTestType.Equal, 1));
	assert(s, gradeRoll, makeGradeRollDiceRoll(DiceTestType.Equal, 10));

	assert(f, gradeRoll, makeGradeRollDiceRoll(DiceTestType.GreaterThan, 1));
	assert(s, gradeRoll, makeGradeRollDiceRoll(DiceTestType.GreaterThan, 20));

	assert(f, gradeRoll, makeGradeRollDiceRoll(DiceTestType.GreaterThan, 1));
	assert(s, gradeRoll, makeGradeRollDiceRoll(DiceTestType.GreaterThanOrEqual, 10));
	assert(s, gradeRoll, makeGradeRollDiceRoll(DiceTestType.GreaterThanOrEqual, 20));

	assert(s, gradeRoll, makeGradeRollDiceRoll(DiceTestType.LessThan, 1));
	assert(f, gradeRoll, makeGradeRollDiceRoll(DiceTestType.LessThan, 20));

	assert(s, gradeRoll, makeGradeRollDiceRoll(DiceTestType.LessThanOrEqual, 1));
	assert(s, gradeRoll, makeGradeRollDiceRoll(DiceTestType.LessThanOrEqual, 10));
	assert(f, gradeRoll, makeGradeRollDiceRoll(DiceTestType.LessThanOrEqual, 20));

	assert(u, gradeRoll, makeGradeRollDiceRoll(0, 11));
}, true);