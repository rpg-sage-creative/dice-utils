import { CharacterManager } from "./CharacterManager.mjs";

export class Character {
	constructor(name, stats, ...companions) {
		this.name = name;
		this.stats = stats ?? {};
		this.companions = new CharacterManager(...(companions ?? []));
	}
	getStat(key) {
		if (key === 'name') {
			return this.name;
		}
		return this.stats[key];
	}
}