import { regex } from "regex";
import { unquote } from "../internal/unquote.js";
function createCharTypeRegex() {
    return regex("i") `
		^
		(?<pcOrStat> pc | stat )?
		(?<alt> companion | hireling | alt | familiar )?
		$
	`;
}
let charTypeRegex;
function getCharTypeRegex() {
    return charTypeRegex ?? (charTypeRegex = createCharTypeRegex());
}
function createStatBlockRegex() {
    return regex("i") `
		(?<!${"`"}) # no tick
		\{
			(?<charName> [\w\s]+ | "[\w\s]+" )
			:{2}
			(?<statKey> [^:\{\}]+ )
			(
				:
				(?<defaultValue> [^\{\}]+ )
			)?
		\}
		(?!${"`"}) # no tick
	`;
}
let statBlockRegex;
function getStatBlockRegex() {
    return statBlockRegex ?? (statBlockRegex = createStatBlockRegex());
}
export function hasStatBlock(value) {
    return getStatBlockRegex().test(value);
}
function parseStatBlock(value) {
    const match = getStatBlockRegex().exec(value);
    if (!match)
        return undefined;
    let [nameOrCharType, statKey, defaultValue] = match.slice(1);
    nameOrCharType = unquote(nameOrCharType).trim();
    statKey = statKey.trim();
    defaultValue = defaultValue?.trim();
    const stackValue = `${nameOrCharType}::${statKey}`.toLowerCase();
    const [charType, isPcType, isAltType] = getCharTypeRegex().exec(nameOrCharType) ?? [];
    const charName = charType ? undefined : nameOrCharType;
    return {
        charName,
        charType,
        defaultValue,
        isAltType: !!isAltType,
        isPcType: !!isPcType,
        stackValue,
        statKey,
    };
}
export function replaceStatBlocks(value, handler, stack) {
    return value.replace(getStatBlockRegex(), match => {
        const statBlock = parseStatBlock(match.toString());
        let result;
        if (statBlock && !stack.includes(statBlock.stackValue)) {
            result = handler(statBlock);
        }
        return result ?? `\`${match}\``;
    });
}
