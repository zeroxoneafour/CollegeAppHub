<script lang="ts">
	import {
		collegeInfoManager,
		isSupplementalRequired,
		Supplemental,
		SupplementalRequired,
		SupplementalType,
		type CollegeInfo,
		type Value
	} from "$lib/colleges.svelte";
	import { goto } from "$app/navigation";

	let collegeSearch = $state("");
	let collegeSearchBar: HTMLInputElement = $state()!;
	let collegeSearchResults = $derived.by(() => {
		return collegeInfoManager.getCollegeIdPairs(collegeSearch.toLocaleLowerCase());
	});

	let collegeId = $state(0);
	let collegeInfo: CollegeInfo | undefined = $state();

	function setCollegeId(id: number) {
		collegeSearch = collegeInfoManager.collegeRealNames.get(id)!;
		collegeId = id;
		collegeInfoManager.fetchCollegeInfo(id).then((info) => (collegeInfo = info));
	}

	function getSupplementalsByRequirement(requirement: SupplementalRequired): () => string[] {
		return () => {
			if (collegeInfo === undefined) return [];
			let supplementalRequirements = collegeInfo.ApplicationDetails.SupplementalRequirements;

			let ret = [];

			const supplementals: [Value, string][] = [
				[supplementalRequirements.EssayOrStatement, "Essay"],
				[supplementalRequirements.Interview, "Interview"],
				[supplementalRequirements.Portfolio, "Portfolio"],
				[supplementalRequirements.AuditionOrPortfolioReview, "Portfolio Review"],
				[supplementalRequirements.Resume, "Resume"]
			];

			for (const [supplemental, text] of supplementals) {
				if (isSupplementalRequired(supplemental) === requirement) {
					ret.push(text);
				}
			}

			return ret;
		};
	}

	const requiredSupplementals = $derived.by(
		getSupplementalsByRequirement(SupplementalRequired.Required)
	);
	const optionalSupplementals = $derived.by(
		getSupplementalsByRequirement(SupplementalRequired.Optional)
	);
	const conditionalSupplementals = $derived.by(
		getSupplementalsByRequirement(SupplementalRequired.Conditional)
	);

	const supplementals: Supplemental[] = $state([]);
	function addSupplemental() {
		supplementals.push(new Supplemental("", SupplementalType.Essay, ""));
	}

	function addCollege() {
		goto("/");
	}
</script>

<div class="flex h-full w-full flex-col items-center gap-10">
	<p class="mt-10 text-4xl">New College</p>
	<div class="dropdown dropdown-center w-1/3">
		<label class="input w-full">
			<svg class="iconify tabler--search" />
			<input
				type="search"
				placeholder="Search for a college to add"
				bind:value={collegeSearch}
				onfocus={() => {
					collegeSearchBar.select();
				}}
				bind:this={collegeSearchBar}
			/>
		</label>
		{#if collegeSearch !== "" && document.activeElement === collegeSearchBar}
			<ul class="dropdown-content menu w-full bg-base-100 shadow-sm">
				{#each collegeSearchResults as college}
					<li class="flex w-full items-center justify-center">
						<button class="w-full justify-center" onclick={() => setCollegeId(college.id)}
							>{collegeInfoManager.collegeRealNames.get(college.id)}</button
						>
					</li>
				{/each}
			</ul>
		{/if}
	</div>
	{#if collegeInfo != undefined}
		<div class="flex flex-row gap-10">
			{#if collegeInfo.CalculatedFields.SATAvg !== 0}
				<div>
					<p class="w-full text-center">Average SAT - {collegeInfo.CalculatedFields.SATAvg}</p>
					<progress class="progress w-full" value={collegeInfo.CalculatedFields.SATAvg} max="1600"
					></progress>
				</div>
			{/if}
			{#if collegeInfo.CalculatedFields.ACTAvg !== 0}
				<div>
					<p class="w-full text-center">Average ACT - {collegeInfo.CalculatedFields.ACTAvg}</p>
					<progress class="progress w-full" value={collegeInfo.CalculatedFields.ACTAvg} max="36"
					></progress>
				</div>
			{/if}
			{#if collegeInfo.CalculatedFields.AcceptanceRate > 0}
				<div>
					<p class="w-full text-center">
						Acceptance Rate - {collegeInfo.CalculatedFields.AcceptanceRate.toFixed(2)}%
					</p>
					<progress
						class="progress w-full"
						value={collegeInfo.CalculatedFields.AcceptanceRate}
						max="100"
					></progress>
				</div>
			{/if}
		</div>
		<div class="flex flex-col items-center">
			<div class="flex flex-row gap-10">
				<h1 class="mb-5 text-4xl">Supplementals</h1>
				<button class="btn" onclick={addSupplemental}>Add Supplemental</button>
			</div>
			<div class="flex flex-row gap-10">
				{#if requiredSupplementals.length !== 0}
					<p class="text-xs">
						Required - {requiredSupplementals.join(", ")}
					</p>
				{/if}
				{#if optionalSupplementals.length !== 0}
					<p class="text-xs">
						Optional - {optionalSupplementals.join(", ")}
					</p>
				{/if}
				{#if conditionalSupplementals.length !== 0}
					<p class="text-xs">
						Conditional - {conditionalSupplementals.join(", ")}
					</p>
				{/if}
			</div>
		</div>
		{#if supplementals.length > 0}
			<ul class="list w-1/2">
				{#each supplementals as supplemental}
					<li class="list-row">
						<input
							class="input"
							type="text"
							bind:value={supplemental.name}
							placeholder="Supplemental name"
						/>
						<select class="select w-auto grow-0" bind:value={supplemental.type}>
							<option disabled selected>Supplemental Type</option>
							<option value={SupplementalType.Essay}>Essay</option>
							<option value={SupplementalType.Portfolio}>Portfolio</option>
							<option value={SupplementalType.Resume}>Resume</option>
						</select>
						<input
							class="list-col-grow input w-auto"
							type="text"
							bind:value={supplemental.link}
							placeholder="Supplemental link"
						/>
						<button
							aria-label="Delete supplemental"
							class="btn btn-square self-end"
							onclick={() => supplementals.splice(supplementals.indexOf(supplemental), 1)}
							><span class="iconify tabler--trash"></span></button
						>
					</li>
				{/each}
			</ul>
		{/if}
		<button class="btn" onclick={addCollege}>Add College</button>
	{:else}
		<a class="btn" href="/">Back</a>
	{/if}
</div>
