import XRegExp from "xregexp";
const DEBUG = false;
export function xRegExp(regex, flags) {
    if (DEBUG) {
        return XRegExp(regex, flags);
    }
    const compact = regex
        .replace(/\#.+\n/g, "")
        .replace(/[\n\t\s]/g, "");
    return new RegExp(compact, flags);
}
