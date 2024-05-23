import { doFloorCeilRound, hasFloorCeilRound } from "./doFloorCeilRound.js";
import { doMinMax, hasMinMax } from "./doMinMax.js";
import { doParentheses, hasParentheses } from "./doParentheses.js";
import { doSimple, isSimple } from "./doSimple.js";
import { unwrapNumbers, hasWrappedNumbers } from "./unwrapNumbers.js";
export function hasMathFunctions(value) {
    return hasMinMax(value)
        || hasFloorCeilRound(value)
        || hasParentheses(value)
        || hasWrappedNumbers(value)
        || isSimple(value);
}
export function doMathFunctions(value) {
    let done = false;
    do {
        if (hasMinMax(value)) {
            value = doMinMax(value);
        }
        else if (hasFloorCeilRound(value)) {
            value = doFloorCeilRound(value);
        }
        else if (hasParentheses(value)) {
            value = doParentheses(value);
        }
        else if (hasWrappedNumbers(value)) {
            value = unwrapNumbers(value);
        }
        else {
            done = true;
        }
    } while (!done);
    return doSimple(value) ?? value;
}
