import type { LayoutLoad } from "./$types";
import { collegeInfoManager } from "$lib/collegeinfo.svelte";

export const prerender = true;
export const ssr = false;
export const csr = true;
export const trailingSlash = "always";

export const load = (async ({ fetch }) => {
	let res = await fetch("/colleges/collegeList.json");
	collegeInfoManager.initialize(await res.json());
}) satisfies LayoutLoad;
