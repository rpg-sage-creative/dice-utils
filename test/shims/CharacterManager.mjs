export class CharacterManager extends Array {
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