import XRegExp from "xregexp";
import { cleanSigns } from "./cleanSigns.js";
function getSimpleRegex() {
    return /^[\s\d.()^*/+-]+$/;
}
export function isSimple(value) {
    return doSimple(value) !== undefined;
}
export function doSimple(value) {
    try {
        if (getSimpleRegex().test(value)) {
            value = cleanSigns(value);
            value = XRegExp.replaceEach(value, [
                [/\s/g, ""],
                [/(\d+)\(([^()]+)\)/g, "$1*($2)"],
                [/\^/g, "**"]
            ]);
            const outValue = eval(value);
            if (outValue === null || outValue === undefined || isNaN(outValue)) {
                return undefined;
            }
            const outStringValue = String(outValue).trim();
            const signRegex = /^[+-]/;
            return signRegex.test(value.trim()) && !signRegex.test(outStringValue)
                ? `+${outStringValue}`
                : outStringValue;
        }
    }
    catch (ex) {
    }
    return undefined;
}
