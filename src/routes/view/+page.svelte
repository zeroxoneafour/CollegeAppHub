<script lang="ts">
	import CollegeList from "$lib/components/CollegeList.svelte";
	import type { UserData } from "$lib/userdata.svelte";
	import { userDataManager } from "$lib/userdata.svelte";
	import type { PageProps } from "./$types";

	let { params, data }: PageProps = $props();
	let uid: string = data.uid;

	let userData: UserData | null | undefined = $state(undefined);

	userDataManager.get(uid).then((x) => (userData = x));
</script>

{#if userData === undefined}
	<p class="flex h-full w-full items-center justify-center">Loading user data...</p>
{:else if userData === null}
	<div class="flex h-full w-full flex-col items-center justify-center gap-10">
		<p>User data not found!</p>
		<a class="btn" href="/">Click to go back</a>
	</div>
{:else}
	<CollegeList {userData} readonly={true}></CollegeList>
{/if}
