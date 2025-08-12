import userData from "$lib/userdata.svelte.js";

export function load({ params, url }) {
	let collegeIndex = url.searchParams.get("index");
	return { college: userData.colleges.at(Number(collegeIndex)) };
}
