import { regex } from "regex";
import { spoilerRegex } from "../internal/spoilerRegex.js";
function createNumberRegex(options) {
    const { anchored, capture, gFlag = "", iFlag = "" } = options ?? {};
    const captureKey = capture ? `?<${capture}>` : ``;
    const numberRegex = regex(iFlag) `
		[\-+]?    # optional pos/neg sign
		\d+       # integer portion
		(\.\d+)?  # optional decimal portion
	`;
    const spoileredRegex = spoilerRegex(numberRegex, options);
    if (anchored) {
        return regex(gFlag + iFlag) `^ (${captureKey} ${spoileredRegex}) $`;
    }
    return regex(gFlag + iFlag) `(${captureKey} ${spoileredRegex})`;
}
const cache = {};
function createCacheKey(options) {
    return [options?.anchored ?? false, options?.capture ?? "", options?.gFlag ?? false, options?.iFlag ?? false, options?.spoilers ?? false].join("|");
}
export function getNumberRegex(options) {
    const key = createCacheKey(options);
    return cache[key] ?? (cache[key] = createNumberRegex(options));
}
