import mainUserData from "$lib/userdata.svelte";

export function load({ params, url }) {
	let collegeIndex = url.searchParams.get("index");
	let userData = mainUserData;
	return { college: userData.colleges.at(Number(collegeIndex)) };
}
