import XRegExp from "xregexp";
import { unquote } from "../internal/unquote.js";
function createCharTypeRegex() {
    return XRegExp(`
		^
		(pc|stat)?
		(companion|hireling|alt|familiar)?
		$
	`, "xi");
}
let charTypeRegex;
function getCharTypeRegex() {
    return charTypeRegex ?? (charTypeRegex = createCharTypeRegex());
}
function createStatBlockRegex() {
    return XRegExp(`
		# no tick
		(?<!\`)

		\\{
			# char name or quoted char name
			(
				[\\w ]+    # <-- should we drop this space?
				|          # <-- in other places we allow alias (no spaces) or "quoted name with spaces"
				"[\\w ]+"
			)

			# separator
			:{2}

			# stat key
			(
				[^:{}]+
			)

			# default value
			(?:
				:
				([^{}]+)
			)?
		\\}

		# no tick
		(?!\`)
	`, `xi`);
}
let statBlockRegex;
function getStatBlockRegex() {
    return statBlockRegex ?? (statBlockRegex = createStatBlockRegex());
}
export function hasStatBlock(value) {
    return getStatBlockRegex().test(value);
}
function parseStatBlock(value) {
    const match = XRegExp.exec(value, getStatBlockRegex());
    if (!match)
        return undefined;
    let [nameOrCharType, statKey, defaultValue] = match.slice(1);
    nameOrCharType = unquote(nameOrCharType).trim();
    statKey = statKey.trim();
    defaultValue = defaultValue?.trim();
    const stackValue = `${nameOrCharType}::${statKey}`.toLowerCase();
    const [charType, isPcType, isAltType] = XRegExp.exec(nameOrCharType, getCharTypeRegex()) ?? [];
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
    return XRegExp.replace(value, getStatBlockRegex(), match => {
        const statBlock = parseStatBlock(match.toString());
        let result;
        if (statBlock && !stack.includes(statBlock.stackValue)) {
            result = handler(statBlock);
        }
        return result ?? `\`${match}\``;
    }, "all");
}
