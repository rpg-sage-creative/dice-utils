export declare function hasStatBlock(value: string): boolean;
type StatBlockResults = {
    charName?: string;
    charType?: string;
    isAltType?: boolean;
    isPcType?: boolean;
    statKey: string;
    stackValue: string;
    defaultValue?: string;
};
type ReplaceHandler = (block: StatBlockResults) => string | undefined;
/** Wraps the value.replace with logic that parses the stat block, checks for recursion, and returns tick blocked match when needed. */
export declare function replaceStatBlocks(value: string, handler: ReplaceHandler, stack: string[]): string;
export {};
