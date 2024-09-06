import { doComplex, hasComplex } from "./doComplex.js";
import { doSimple, hasSimple } from "./doSimple.js";
export function hasMath(value) {
    return hasComplex(value)
        || hasSimple(value);
}
export function processMath(value) {
    value = doComplex(value);
    value = doSimple(value);
    return value;
}
