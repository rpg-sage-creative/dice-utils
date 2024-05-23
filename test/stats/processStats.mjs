import { debug, info, warn } from "@rsc-utils/console-utils";
import { assert, runTests, startAsserting, stopAsserting } from "@rsc-utils/test-utils";
import { processStats } from "../../build/index.js"

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
		this.stats = stats ?? { };
		this.companions = new CharManager(...(companions ?? []));
	}
	getStat(key) {
		return this.stats[key];
	}
}
class Encounter extends Array {
	findActiveChar(name) {
		return this.find(c => c.name.toLowerCase() === name.toLowerCase());
	}
}

runTests(async function test_processStats() {
	const encounters = new Encounter();
	const npcs = new CharManager();
	const pc = new Char("testy", { ac:"10", atkMod:"5" }, new Char("moldy", { ac:"15" }));
	const pcs = new CharManager(pc);
	const args = { encounters, npcs, pcs, pc };
	const tests = [
		["[1d20 + {testy::atkMod} ac {moldy::ac}]","[1d20 + 5 ac 15]"],
	];
	tests.forEach(([input,expected]) => {
		assert(String(expected), processStats, input, args);
	})
}, true);