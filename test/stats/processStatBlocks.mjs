import { debug, info, warn } from "@rsc-utils/core-utils";
import { assert, runTests, startAsserting, stopAsserting } from "@rsc-utils/core-utils";
import { processStatBlocks } from "../../build/index.js"
import { Encounter } from "../shims/Encounter.mjs";
import { CharacterManager } from "../shims/CharacterManager.mjs";
import { Character } from "../shims/Character.mjs";

function getArgs() {
	const encounters = new Encounter();

	const repeat = new Character("repeat", { repeat:"{repeat::repeat}"});
	const npcs = new CharacterManager(repeat);

	const testy = new Character("testy", { ac: "10", atkMod: "5" }, new Character("moldy", { ac: "15" }));
	const nesty = new Character("nesty", { nested_stat_id: "nested_stat", nested_stat: "Nested!" });
	const complex = new Character("complex", {
		default_weapon: "longsword",
		"longsword.name": "Longsword",
		"longsword.attack": "7",
		"longsword.damage": "1d8+4 slashing",
		"dagger.name": "Shiny Dagger",
		"dagger.attack": "8",
		"dagger.damage": "1d4+4 piercing"
	});
	const pcs = new CharacterManager(testy, nesty, complex);
	return { encounters, npcs, pcs, pc: testy };
}


runTests(async function test_processStatBlocks() {
	const args = getArgs();
	const tests = [
		["[(10)1d20]", "[(10)1d20]"],
		["[(10)1d20 ac (10)]", "[(10)1d20 ac 10]"],
		["[(10)1d20 ac (10-2)]", "[(10)1d20 ac 8]"],
		["[1d20 + {testy::atkMod} ac {moldy::ac}]", "[1d20 + 5 ac 15]"],
		[`[1d20 + {"testy"::atkMod} ac {moldy::ac}]`, "[1d20 + 5 ac 15]"],
		["[(1)1d20 + {testy::atkMod} ac {moldy::ac}]", "[(1)1d20 + 5 ac 15]"],
		["[1d20 {nesty::{nesty::nested_stat_id}}]", "[1d20 Nested!]"],
		[
			"[1d20 + {complex::{complex::default_weapon}.attack:0} {complex::name} strikes with their {complex::{complex::default_weapon}.name:weapon}!;{complex::{complex::default_weapon}.damage:0}]",
			"[1d20 + 7 complex strikes with their Longsword!;1d8+4 slashing]"
		],
		["[1d30 {repeat::repeat}]", "[1d30 `{repeat::repeat}`]"],

		// these tests specifically test the application of doSimple and doMathFunctions
		["[1d20+1bard+1str]", "[1d20+1bard+1str]"],
		["[1d20 + 1 bard + 1 str]", "[1d20 + 1 bard + 1 str]"],
		["[1d20+1bard+1+3str]", "[1d20+1bard+4str]"],
		["[1d20 + 1 bard + 1 + 3 str]", "[1d20 + 1 bard + 4 str]"],
		["[1d6+3%2+1d8]", "[1d6+1+1d8]"],
		["[1d6+floor(5/3)+1d8]", "[1d6+1+1d8]"],
		["[1d6+3+4+1d8]", "[1d6+7+1d8]"],
		["[1d6 +3+4+1 d8]", "[1d6 +8 d8]"],
		["[1d6+3+4+1d8+1+2]", "[1d6+7+1d8+3]"],
		["[1d6+3fire+4+1d8]", "[1d6+3fire+4+1d8]"],
		["[1d20 ac {moldy::ac}; 1d6+3+4+1d8]", "[1d20 ac 15; 1d6+7+1d8]"],
		["[1d20 ac {moldy::ac}; 1d6+3str+4fire+1d8]", "[1d20 ac 15; 1d6+3str+4fire+1d8]"],
		["[1d20 ac {moldy::ac}; 1d6 +3 str +4 fire + 1d8]", "[1d20 ac 15; 1d6 +3 str +4 fire + 1d8]"],
		["[1d20 ac {moldy::ac}; 1d6 + 3 +1d8 -4]", "[1d20 ac 15; 1d6 + 3 +1d8 -4]"],
		["[1d20 ac {moldy::ac}; 1d6 + 3 fire +1d8 -4 str]", "[1d20 ac 15; 1d6 + 3 fire +1d8 -4 str]"],
		["[1d20 ac {moldy::ac}; 1d6+3+4-5+1d8]", "[1d20 ac 15; 1d6+2+1d8]"],
		["[1d20 ac {moldy::ac}; 1d6-3+4-5+1d8]", "[1d20 ac 15; 1d6-4+1d8]"],
		["[1d20 ac {moldy::ac}; 1d6-3+4+5+1d8]", "[1d20 ac 15; 1d6+6+1d8]"],
		["[1d20 ac {moldy::ac}; 1d6+(floor(5/3))+1d8]", "[1d20 ac 15; 1d6+1+1d8]"],

		["[1d20 (deadly d8) ac {moldy::ac}; 1d6]", "[1d20 (deadly d8) ac 15; 1d6]"],
		["[2d20kh1+18]", "[2d20kh1+18]"],
		["[2d20kh1+18dc20]", "[2d20kh1+18dc20]"],
	];
	tests.forEach(([input, expected]) => {
		assert(String(expected), processStatBlocks, input, args);
	})
}, true);