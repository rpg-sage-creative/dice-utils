import { unquote } from "./unquote.js";
export function unquoteAndDetick(value) {
    return unquote(value).replace(/`/g, "");
}
