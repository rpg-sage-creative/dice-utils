import XRegExp from "xregexp";
const DEBUG = false;
export function xRegExp(regex, flags) {
    if (DEBUG || !flags.includes("x")) {
        return XRegExp(regex, flags);
    }
    regex = regex
        .replace(/(?<!\\)\#.+\n/g, "")
        .replace(/[\n\t\s]/g, "");
    flags = flags.replace(/x/g, "");
    return XRegExp(regex, flags);
}
