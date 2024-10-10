import { regex } from "regex";
import { spoilerRegex } from "../internal/spoilerRegex.js";
function createNumberRegex(options) {
    const { anchored, capture, gFlag = "", iFlag = "" } = options ?? {};
    const numberRegex = regex(iFlag) `
		[\-+]?    # optional pos/neg sign
		\d+       # integer portion
		(\.\d+)?  # optional decimal portion
	`;
    const spoileredRegex = spoilerRegex(numberRegex, options);
    if (anchored) {
        if (capture) {
            return regex(gFlag + iFlag) `^ (?<${capture}> ${spoileredRegex}) $`;
        }
        return regex(gFlag + iFlag) `^ ${spoileredRegex} $`;
    }
    if (capture) {
        return regex(gFlag + iFlag) `(?<${capture}> ${spoileredRegex})`;
    }
    return regex(gFlag + iFlag) `${spoileredRegex}`;
}
const cache = {};
export function getNumberRegex(options) {
    if (options?.gFlag)
        return createNumberRegex(options);
    const key = [options?.anchored ?? "", options?.capture ?? "", options?.gFlag ?? "", options?.iFlag ?? "", options?.spoilers ?? ""].join("|");
    return cache[key] ?? (cache[key] = createNumberRegex(options));
}
