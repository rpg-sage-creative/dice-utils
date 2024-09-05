import { doMathFunctions, hasMathFunctions } from "./doMathFunctions.js";
import { doSimple, isSimple } from "./doSimple.js";
export function hasMath(value) {
    return hasMathFunctions(value)
        || isSimple(value);
}
export function processMath(value) {
    if (hasMathFunctions(value)) {
        value = doMathFunctions(value);
    }
    return doSimple(value) ?? value;
}
