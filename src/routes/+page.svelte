<script lang="ts">
	import userData from "$lib/userdata.svelte";
</script>

{#if userData.colleges.length === 0}
	<div class="flex h-full w-full items-center justify-center">
		<a class="btn" href="/addcollege">Add a new college!</a>
	</div>
{:else}
	<div class="flex flex-col items-center"></div>
{/if}
