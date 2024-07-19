/**
 * This file uses code and math to generate macros for Blades in the Dark
 */

import { writeFileSync } from "fs";

const a6 = [1,2,3,4,5,6];


function calcMaxes(rolls) {
	let crits = 0;
	const maxes = { 1:0, 2:0, 3:0, 4:0, 5:0, 6:0 };
	rolls.forEach(roll => {
		const max = eval(`Math.max(${roll})`);
		maxes[max]++;

		const crit = roll.split(",").filter(v => v === "6").length > 1;
		if (crit) crits++;
	});
	const dieSpreads = calcDieSpreads(maxes);
	const resultSpreads = calcResultSpreads(dieSpreads, crits);
	return { maxes, dieSpreads, crits, resultSpreads };
}

function calcDieSpreads(maxes) {
	const results = [];
	let min = 0, max = 0;
	for (let i = 1; i < 7; i++) {
		const count = maxes[i];
		min = max + 1;
		max = min + count - 1;
		results[i] = `${min}-${max}`;
	}
	return results;
}

function calcResultSpreads(dieSpreads, crits) {
	const failMin = +dieSpreads[1].split("-")[0];
	const failMax = +dieSpreads[3].split("-")[1];
	const sucCMin = +dieSpreads[4].split("-")[0];
	const sucCMax = +dieSpreads[5].split("-")[1];
	const succMin = +dieSpreads[6].split("-")[0];
	let succMax = +dieSpreads[6].split("-")[1];
	let critMin = 0;
	let critMax = 0;
	if (crits) {
		critMax = succMax;
		succMax -= crits;
		critMin = succMax + 1;
	}
	return [
		`${failMin}-${failMax}\tBad Outcome`,
		`${sucCMin}-${sucCMax}\tPartial Success`,
		`${succMin}-${succMax}\tFull Success`,
		crits ? `${critMin}-${critMax}\tCritical Success` : ``
	].filter(s => s);
}

const macros = [];

const arrays = [[], a6.map(i => String(i))];
for (let count = 1; count < 8; count++) {
	const rolls = arrays[count] = count === 1 ? a6.map(String) : arrays[count-1].map(s => a6.map(i => `${s},${i}`)).flat();
	const rollCount = rolls.length;
	const { maxes, dieSpreads, crits, resultSpreads } = calcMaxes(rolls);
	macros.push(`sage!macro set cat="BitD" name="BitD${count}" dice="[${resultSpreads.join("\n").replace("\t", " ")}]"`);
	console.log({count,rollCount,maxes,dieSpreads,crits,resultSpreads});
}

writeFileSync("./bitd-macros.md", macros.join("\n\n"));