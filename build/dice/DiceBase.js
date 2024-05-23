export class DiceBase {
    core;
    constructor(core) {
        this.core = core;
    }
    _children;
    get children() {
        if (!this._children) {
            const childClass = this.constructor.Child;
            this._children = this.core.children.map(childCore => childClass.fromCore(childCore));
        }
        return this._children;
    }
    get gameType() {
        return this.core.gameType;
    }
    get hasSecret() {
        return this.children.some(child => child.hasSecret);
    }
    get hasTest() {
        return this.children.some(child => child.hasTest);
    }
    get id() { return this.core.id; }
    get objectType() {
        return this.core.objectType;
    }
    roll() {
        this.children.forEach(child => child.roll());
        return this;
    }
    toJSON() {
        return this.core;
    }
    static create(..._args) {
        throw new TypeError("Not Implemented.");
    }
    static fromCore(_core) {
        throw new TypeError("Not Implemented.");
    }
    static fromTokens(_tokens, ..._args) {
        throw new TypeError("Not Implemented.");
    }
    static Child;
    static GameType = 0;
}
