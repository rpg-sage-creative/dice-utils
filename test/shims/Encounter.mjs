export class Encounter extends Array {
	findActiveChar(name) {
		return this.find(c => c.name.toLowerCase() === name.toLowerCase());
	}
}