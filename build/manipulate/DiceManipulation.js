export class DiceManipulation {
    data;
    constructor(data) {
        this.data = data;
    }
    get isEmpty() { return !this.type || !this.value; }
    toJSON() {
        return this.isEmpty ? undefined : this.data;
    }
}
