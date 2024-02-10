import { DicePart } from "../dice/DicePart.js";
import { reduceTokenToDicePartCore } from "./reduceTokenToDicePartCore.js";
export function tokensToDicePart(tokens) {
    const core = tokens.reduce(reduceTokenToDicePartCore, { description: "" });
    return DicePart.create(core);
}
