<script lang="ts">
	import { College, dueDateToDate, Supplemental, SupplementalType } from "$lib/colleges.svelte";
	import { UserData } from "$lib/userdata.svelte";
	import DatePicker from "./ui/DatePicker.svelte";
	let { college, userData }: { college: College, userData: UserData } = $props();

	let collegeInfo = $derived(college.collegeInfo);

	function addSupplemental() {
		college.supplementals.push(new Supplemental("", SupplementalType.Essay, ""));
	}
</script>

<div class="flex w-full flex-col items-center gap-10">
	<div class="grid grid-cols-2 gap-2">
		<p class="text-nowrap text-lg w-full h-full flex justify-end items-center">Application link -</p>
		<div class="tooltip w-full h-full">
			{#if collegeInfo != null && collegeInfo.WwwUrl != ""}
				<div class="tooltip-content">
					<p>Main college URL - {collegeInfo.WwwUrl}</p>
				</div>
			{/if}
			<input type="url" class="input" bind:value={college.applicationLink} placeholder="Application Link" />
		</div>
		<p class="text-nowrap text-lg w-full h-full flex justify-end items-center">Application Due Date -</p>
		<div class="tooltip w-full h-full">
			{#if collegeInfo != null && collegeInfo.ApplicationRounds.length > 0}
				<div class="tooltip-content">
					{#each collegeInfo.ApplicationRounds as round}
						<p>{round.Name} - {dueDateToDate(round.DueDate).toDateString()}{round.Binding ? " (Binding)" : ""}</p>
					{/each}
				</div>
			{/if}
			<DatePicker bind:date={college.dueDate}></DatePicker>
		</div>
	</div>
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
