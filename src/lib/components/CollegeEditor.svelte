<script lang="ts">
	import { College, Supplemental, SupplementalType } from "$lib/colleges.svelte";
	let { college }: { college: College } = $props();

	function addSupplemental() {
		college.supplementals.push(new Supplemental("", SupplementalType.Essay, ""));
	}
</script>

<div class="flex w-full flex-col items-center gap-10">
	<div class="flex flex-col gap-10 md:flex-row">
		<h1 class="text-4xl">Supplementals</h1>
		<button class="btn" onclick={addSupplemental}>Add Supplemental</button>
	</div>
	{#if college.supplementals.length > 0}
		<ul class="list">
			{#each college.supplementals as supplemental}
				<li class="list-row">
					<input
						class="input"
						type="text"
						bind:value={supplemental.name}
						placeholder="Supplemental name"
					/>
					<select class="select" bind:value={supplemental.type}>
						<option disabled selected>Supplemental Type</option>
						<option value={SupplementalType.Essay}>Essay</option>
						<option value={SupplementalType.Portfolio}>Portfolio</option>
						<option value={SupplementalType.Resume}>Resume</option>
					</select>
					<input
						class="list-col-grow input"
						type="text"
						bind:value={supplemental.link}
						placeholder="Supplemental link"
					/>
					<button
						aria-label="Delete supplemental"
						class="btn btn-square self-end"
						onclick={() =>
							college.supplementals.splice(college.supplementals.indexOf(supplemental), 1)}
						><span class="iconify tabler--trash"></span></button
					>
				</li>
			{/each}
		</ul>
	{/if}
</div>
