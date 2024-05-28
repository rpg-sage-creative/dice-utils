import { debug, info, warn } from "@rsc-utils/console-utils";
import { assert, runTests, startAsserting, stopAsserting } from "@rsc-utils/test-utils";
import { processStatBlocks } from "../../build/index.js"

class CharManager extends Array {
	findByName(name) {
		return this.find(c => c.name.toLowerCase() === name.toLowerCase());
	}
	findCompanion(name) {
		for (const char of this) {
			const comp = char.companions.findByName(name);
			if (comp) return comp;
		}
		return undefined;
	}
}
class Char {
	constructor(name, stats, ...companions) {
		this.name = name;
		this.stats = stats ?? {};
		this.companions = new CharManager(...(companions ?? []));
	}
	getStat(key) {
		if (key === 'name') {
			return this.name;
		}
		return this.stats[key];
	}
}
class Encounter extends Array {
	findActiveChar(name) {
		return this.find(c => c.name.toLowerCase() === name.toLowerCase());
	}
}

runTests(async function test_processStatBlocks() {
	const encounters = new Encounter();
	const npcs = new CharManager();
	const testy = new Char("testy", { ac: "10", atkMod: "5" }, new Char("moldy", { ac: "15" }));
	const nesty = new Char("nesty", { nested_stat_id: "nested_stat", nested_stat: "Nested!" });
	const complex = new Char("complex", {
		default_weapon: "longsword",
		"longsword.name": "Longsword",
		"longsword.attack": "7",
		"longsword.damage": "1d8+4 slashing",
		"dagger.name": "Shiny Dagger",
		"dagger.attack": "8",
		"dagger.damage": "1d4+4 piercing"
	});
	const pcs = new CharManager(testy, nesty, complex);
	const args = { encounters, npcs, pcs, pc: testy };
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
	];
	tests.forEach(([input, expected]) => {
		assert(String(expected), processStatBlocks, input, args);
	})
}, true);