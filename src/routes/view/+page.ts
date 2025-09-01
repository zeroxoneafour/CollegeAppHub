export function load({ params, url }) {
	return { uid: url.searchParams.get("uid") ?? "" };
}
