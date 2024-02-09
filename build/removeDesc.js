import { tokenize } from "@rsc-utils/string-utils";
import * as XRegExp from "xregexp";
export function removeDesc(description, desc) {
    const tokens = tokenize(description, { html: /<[^>]+>/, desc: new RegExp(XRegExp.escape(desc)) });
    const firstDesc = tokens.find(token => token.key === "desc");
    return tokens
        .filter(token => token !== firstDesc)
        .map(token => token.token)
        .join("");
}
