import fs from "node:fs";

const opts = {
	api: "https://app.scoir.com/api/college/",
	search: "https://app.scoir.com/api/search/college/",
	// known fields - details,affiliateColleges,location,studentLife,academics,admissions,financials,map,athletics
	params: "?fields=details,admissions,financials",
	output: "static/colleges/"
};

console.log("Running crawler");

console.log("Generating college list");

const searchStack = Array.from(Array(26).keys(), (x) => String.fromCharCode(x + "a".charCodeAt(0)));
const collegeList = new Set<number>();
// maps college name to id
const collegeIds = {};
// maps college id to name
const collegeIdsInverted = {};

while (searchStack.length !== 0) {
	const searchStr = searchStack.pop();
	const res = await fetch(opts.search + searchStr);
	if (res.status !== 200) continue;
	process.stdout.cursorTo(0);
	process.stdout.write("Querying " + opts.search + " for " + searchStr);
	process.stdout.clearLine(1);
	const colleges = JSON.parse(await res.text());

	let savedColleges = 0;
	for (const college of colleges) {
		if (collegeList.has(college.value)) {
			savedColleges += 1;
		} else {
			collegeList.add(college.value);
			collegeIds[college.name] = college.value;
			collegeIdsInverted[college.id] = college.name;
		}
	}

	// do not keep querying if the college search results are not full or all the colleges have been saved
	// to keep querying, just append all the next letters and space
	if (colleges.length !== 15 || savedColleges === colleges.length) continue;
	searchStack.push(
		...Array.from(Array(26).keys(), (c) => searchStr + String.fromCharCode(c + "a".charCodeAt(0)))
	);
	searchStack.push(searchStr + " ");
}

fs.writeFileSync(opts.output + "collegeList.json", JSON.stringify(collegeIds));

process.stdout.write("\n");
console.log(`Reading data from ${collegeList.size} colleges`);

if (!fs.existsSync(opts.output)) {
	fs.mkdirSync(opts.output);
}

for (const id of collegeList) {
	const res = await fetch(opts.api + id + opts.params);
	if (res.status !== 200) continue;
	process.stdout.cursorTo(0);
	process.stdout.write("Getting college info for " + collegeIdsInverted[id]);
	process.stdout.clearLine(1);
	const collegeInfo = await res.text();
	fs.writeFileSync(opts.output + id + ".json", collegeInfo);
}
process.stdout.write("\n");
