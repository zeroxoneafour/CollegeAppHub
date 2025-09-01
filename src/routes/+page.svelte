<script lang="ts">
	import CollegeList from "$lib/components/CollegeList.svelte";
	import userData from "$lib/userdata.svelte";
</script>

{#if userData.colleges.length > 0}
	<CollegeList {userData} readonly={false}></CollegeList>
{:else}
	<div class="flex h-full w-full items-center justify-center">
		<a class="btn" href="/addcollege">Add a new college!</a>
	</div>
{/if}
