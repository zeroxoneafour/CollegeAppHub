import mainUserData, { userDataManager } from "$lib/userdata.svelte";

export function load({ params, url }) {
	let userData = mainUserData;
	if (url.searchParams.has("userData")) {
		userData = userDataManager.get(url.searchParams.get("userData")!);
	}
	return { userData: userData };
}