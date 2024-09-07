import { doComplex, hasComplex } from "./doComplex.js";
import { doSimple, hasSimple } from "./doSimple.js";
export function hasMath(value, options) {
    return hasComplex(value, options)
        || hasSimple(value, options);
}
export function processMath(value, options) {
    value = doComplex(value, options);
    value = doSimple(value, options);
    return value;
}
