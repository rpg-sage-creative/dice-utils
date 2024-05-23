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
            value = value.replace(/\s/g, "");
            value = cleanSigns(value);
            value = value.replace(/(\d+)\(([^()]+)\)/g, "$1*($2)");
            value = value.replace(/\^/g, "**");
            return String(eval(value));
        }
    }
    catch (ex) {
    }
    return null;
}
