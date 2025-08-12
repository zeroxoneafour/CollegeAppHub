<script lang="ts">
	import CollegeDisplay from "$lib/components/CollegeDisplay.svelte";
	import userData from "$lib/userdata.svelte";
</script>

{#if userData.colleges.length > 0}
	<div class="flex flex-col items-center">
		{#each userData.colleges as college}
			<CollegeDisplay {college} {userData}></CollegeDisplay>
		{/each}
	</div>
{:else}
	<div class="flex h-full w-full items-center justify-center">
		<a class="btn" href="/addcollege">Add a new college!</a>
	</div>
{/if}
