import XRegExp from "xregexp";
import { cleanSigns } from "./cleanSigns.js";
function getSimpleRegex() {
    return /^[\s\d.()^*/+-]+$/;
}
export function isSimple(value) {
    return doSimple(value) !== null;
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
            return String(eval(value));
        }
    }
    catch (ex) {
    }
    return null;
}
