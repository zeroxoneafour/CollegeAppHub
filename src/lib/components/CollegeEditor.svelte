<script lang="ts">
	import { College, NamedDate, Supplemental, SupplementalType } from "$lib/colleges.svelte";
	import OptionalOption from "./ui/OptionalOption.svelte";
	import DatePicker from "./ui/DatePicker.svelte";
	let { college }: { college: College } = $props();

	let collegeInfo = $derived(college.collegeInfo);

	function addSupplemental() {
		college.supplementals.push(new Supplemental("", SupplementalType.Essay, ""));
	}
	function addDate() {
		college.dates.push(new NamedDate("", new Date()));
	}

	let collegeInfoOpen: boolean = $state(false);
	function toggleCollegeInfo() {
		if (!collegeInfoOpen) {
			collegeInfo.collegeId = null;
			collegeInfoOpen = true;
		} else {
			collegeInfoOpen = false;
		}
	}
</script>

<div class="flex w-full flex-col items-center gap-10">
	<div class="grid grid-cols-2 gap-2">
		<p class="flex h-full w-full items-center justify-end text-lg text-nowrap">
			Application link -
		</p>
		<div class="tooltip h-full w-full">
			{#if collegeInfo.url != null}
				<div class="tooltip-content">
					<p>Main college URL - {collegeInfo.url}</p>
				</div>
			{/if}
			<input
				type="url"
				class="input"
				bind:value={college.applicationLink}
				placeholder="Application Link"
			/>
		</div>
		<p class="flex h-full w-full items-center justify-end text-lg text-nowrap">
			Application Due Date -
		</p>
		<div class="tooltip h-full w-full">
			{#if collegeInfo.applicationRounds.length > 0}
				<div class="tooltip-content">
					{#each collegeInfo.applicationRounds as round}
						<p>
							{round.name} - {round.dueDate.toLocaleDateString()}{round.binding ? " (Binding)" : ""}
						</p>
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
	<div class="flex flex-col gap-10 md:flex-row">
		<h1 class="text-4xl">Dates</h1>
		<button class="btn" onclick={addDate}>Add Date</button>
	</div>
	{#if college.dates.length > 0}
		<ul class="list">
			{#each college.dates as date}
				<li class="list-row">
					<input
						class="list-col-grow input"
						type="text"
						bind:value={date.name}
						placeholder="Date name"
					/>
					<DatePicker bind:date={date.date}></DatePicker>
					<button
						aria-label="Delete date"
						class="btn btn-square self-end"
						onclick={() => college.dates.splice(college.dates.indexOf(date), 1)}
						><span class="iconify tabler--trash"></span></button
					>
				</li>
			{/each}
		</ul>
	{/if}
	<button class="btn" onclick={toggleCollegeInfo}
		>{collegeInfoOpen ? "Close" : "Edit"} College Info</button
	>
	{#if collegeInfoOpen}
		<div class="flex flex-col items-center gap-2">
			<input class="input" bind:value={collegeInfo.name} placeholder="College Name" />
			<OptionalOption name="ACT Score" type="threenumber" bind:value={collegeInfo.actScore}
			></OptionalOption>
			<OptionalOption name="SAT Score" type="threenumber" bind:value={collegeInfo.satScore}
			></OptionalOption>
			<OptionalOption name="Acceptance Rate" type="number" bind:value={collegeInfo.acceptanceRate}
			></OptionalOption>
		</div>
	{/if}
</div>
