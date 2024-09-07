import XRegExp from "xregexp";
const DEBUG = false;
export function xRegExp(regex, flags) {
    if (DEBUG) {
        return XRegExp(regex, flags);
    }
    regex = regex
        .replace(/\#.+\n/g, "")
        .replace(/[\n\t\s]/g, "");
    flags = flags.replace(/x/g, "");
    return new RegExp(regex, flags);
}
