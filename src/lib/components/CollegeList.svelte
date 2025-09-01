<script lang="ts">
	import { UserData } from "$lib/userdata.svelte";
	import CollegeDisplay from "./CollegeDisplay.svelte";

	let { userData, readonly = false }: { userData: UserData; readonly: boolean } = $props();
</script>

<ul class="list w-full">
	{#each userData.colleges as college}
		<li class="list-row w-full">
			<div class="list-col-grow">
				<CollegeDisplay {college} {userData} {readonly}></CollegeDisplay>
			</div>
		</li>
	{/each}
</ul>
