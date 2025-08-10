import type { LayoutLoad } from "./$types";
import { collegeInfoManager } from "$lib/colleges.svelte";

export const prerender = true;

export const load = (async ({ fetch }) => {
	let res = await fetch("/colleges/collegeList.json");
	collegeInfoManager.initialize(await res.json());
}) satisfies LayoutLoad;
