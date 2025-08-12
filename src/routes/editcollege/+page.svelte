<script lang="ts">
	import { type College } from "$lib/colleges.svelte";
	import { type PageProps } from "./$types";
	import CollegeEditor from "$lib/components/CollegeEditor.svelte";
	import { UserData } from "$lib/userdata.svelte";

	let { params, data }: PageProps = $props();
	let college: College | undefined = data.college;
	let userData: UserData = data.userData;
</script>

<div class="flex h-full w-full p-10">
	{#if college != undefined}
		<CollegeEditor {college} {userData}></CollegeEditor>
	{:else}
		<p>College not found!</p>
	{/if}
</div>
