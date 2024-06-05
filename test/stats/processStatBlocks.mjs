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
		["[1d20 + {testy::atkMod} ac {moldy::ac}]", "[1d20 + 5 ac 15]"],
		[`[1d20 + {"testy"::atkMod} ac {moldy::ac}]`, "[1d20 + 5 ac 15]"],
		["[(1)1d20 + {testy::atkMod} ac {moldy::ac}]", "[(1)1d20 + 5 ac 15]"],
		["[1d20 {nesty::{nesty::nested_stat_id}}]", "[1d20 Nested!]"],
		[
			"[1d20 + {complex::{complex::default_weapon}.attack:0} {complex::name} strikes with their {complex::{complex::default_weapon}.name:weapon}!;{complex::{complex::default_weapon}.damage:0}]",
			"[1d20 + 7 complex strikes with their Longsword!;1d8+4 slashing]"
		],
		["[1d30 {repeat::repeat}]", "[1d30 `{repeat::repeat}`]"]
	];
	tests.forEach(([input, expected]) => {
		assert(String(expected), processStatBlocks, input, args);
	})
}, true);