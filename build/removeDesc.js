import * as XRegExp from "xregexp";
import { tokenize } from "./internal/tokenize.js";
export function removeDesc(description, desc) {
    const tokens = tokenize(description, { html: /<[^>]+>/, desc: XRegExp(XRegExp.escape(desc)) });
    const firstDesc = tokens.find(token => token.key === "desc");
    return tokens
        .filter(token => token !== firstDesc)
        .map(token => token.token)
        .join("");
}
