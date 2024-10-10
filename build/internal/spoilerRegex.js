import { regex } from "regex";
export function spoilerRegex(regexp, options) {
    const { iFlag = "", spoilers } = options ?? {};
    if (spoilers) {
        const pipedRegex = regex(iFlag) `${"||"} ${regexp} ${"||"}`;
        return spoilers === "optional"
            ? regex(iFlag) `( ${pipedRegex} | ${regexp} )`
            : pipedRegex;
    }
    return regexp;
}
