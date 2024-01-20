import { enableLogLevels, warn } from "@rsc-utils/console-utils";
import { testDiceRollString } from "./rollDiceString.mjs";

async function main() {
	warn(`create rollDice tests`);
	testDiceRollString();
	warn(`create rollDie tests`);
}
enableLogLevels("development");
main();