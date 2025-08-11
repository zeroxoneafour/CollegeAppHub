import fs from "node:fs";

const opts = {
	api: "https://app.scoir.com/api/college/",
	search: "https://app.scoir.com/api/search/college/",
	// known fields - details,affiliateColleges,location,studentLife,academics,admissions,financials,map,athletics
	params: "?fields=details,admissions,financials",
	output: "static/colleges/",
	searchTimeout: 1000,
	infoTimeout: 10
};

console.log("Running crawler");

console.log("Generating college list");

// maps college name to id
const collegeList = new Map<string, number>();

function createSearchPromises(searchStr: string): Promise<void>[] {
	const nextSearches = Array.from(
		Array(26).keys(),
		(c) => searchStr + String.fromCharCode(c + "a".charCodeAt(0))
	);
	if (searchStr.slice(-1) !== " ") nextSearches.push(searchStr + " ");

	// small timeout to prevent inconsistencies in fetching
	return Array.from(nextSearches, (x) => searchForSchools(x));
}
async function searchForSchools(searchStr: string): Promise<void> {
	searchStr.trimEnd();
	process.stdout.cursorTo(0);
	process.stdout.write("Querying " + opts.search + " for " + searchStr.trimEnd());
	process.stdout.clearLine(1);

	let res: Response;
	try {
		res = await fetch(opts.search + searchStr.trimEnd());
	} catch (_) {
		// try again
		return searchForSchools(searchStr);
	}
	if (res.status !== 200) {
		return;
	}
	const colleges = JSON.parse(await res.text());

	for (const college of colleges) {
		if (!collegeList.has(college.name)) {
			collegeList.set(college.name, college.value);
		}
	}

	// keep querying if the college search results are full
	if (colleges.length !== 15) return;

	// small timeout to prevent inconsistencies in fetching
	await new Promise((resolve) => setTimeout(resolve, opts.searchTimeout));
	await Promise.all(createSearchPromises(searchStr));
}

const searchPromises = Array.from(Array(26).keys(), (x) =>
	searchForSchools(String.fromCharCode(x + "a".charCodeAt(0)))
);
await Promise.all(searchPromises);

const mapToObj = (m: Map<string, number>) => {
	return Array.from(m).reduce((obj: object, [key, value]) => {
		obj[key] = value;
		return obj;
	}, {});
};

fs.writeFileSync(opts.output + "collegeList.json", JSON.stringify(mapToObj(collegeList)));

process.stdout.write("\n");
console.log(`Reading data from ${collegeList.size} colleges`);

if (!fs.existsSync(opts.output)) {
	fs.mkdirSync(opts.output);
}

async function writeCollegeData(name: string, id: number): Promise<void> {
	process.stdout.cursorTo(0);
	process.stdout.write("Getting college info for " + name);
	process.stdout.clearLine(1);

	let res: Response;
	try {
		res = await fetch(opts.api + id + opts.params);
		if (res.status !== 200) return;
	} catch (err) {
		return;
	}
	const collegeInfo = await res.text();
	fs.writeFileSync(opts.output + id + ".json", collegeInfo);
}

const infoPromises: Promise<void>[] = [];

for (const key of collegeList.keys()) {
	infoPromises.push(writeCollegeData(key, collegeList.get(key)!));
	await new Promise((resolve) => setTimeout(resolve, opts.infoTimeout));
}
await Promise.all(infoPromises);

process.stdout.write("\n");
