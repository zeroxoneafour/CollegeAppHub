import mainUserData, { userDataManager } from "$lib/userdata.svelte";

export function load({ params, url }) {
	let collegeIndex = url.searchParams.get("index");
	let userData = mainUserData;
	if (url.searchParams.has("userData")) {
		userData = userDataManager.get(url.searchParams.get("userData")!);
	}
	return { college: userData.colleges.at(Number(collegeIndex)), userData: userData };
}