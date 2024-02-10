import { DiceOutputType } from "../types/DiceOutputType.js";
export function isDiceOutputType(value) {
    return typeof (value) === "number" && DiceOutputType[value] !== undefined;
}
