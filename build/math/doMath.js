import { getSimpleRegex } from "./doSimple.js";
export function doMath(noBraces) {
    try {
        if (getSimpleRegex().test(noBraces)) {
            const equation = noBraces
                .replace(/ /g, "")
                .replace(/(\d+)\(([^)]+)\)/g, "($1*($2))")
                .replace(/(\d)\(/g, "$1*(")
                .replace(/\^/g, "**");
            return String(eval(equation));
        }
    }
    catch (ex) {
    }
    return null;
}
