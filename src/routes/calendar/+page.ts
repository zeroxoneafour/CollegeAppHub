import mainUserData from "$lib/userdata.svelte";

export function load({ params, url }) {
	let userData = mainUserData;
	return { userData: userData };
}
