<script lang="ts">
	import { collegeInfoManager, type CollegeInfo } from "$lib/colleges.svelte";

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
</script>

<div class="mt-10 flex h-full w-full flex-col items-center gap-10">
	<p class="text-2xl">New College</p>
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
			<ul class="dropdown-content menu w-full shadow-sm">
				{#each collegeSearchResults as college}
					<li class="flex w-full items-center justify-center bg-base-100">
						<button class="w-full justify-center" onclick={() => setCollegeId(college.id)}
							>{collegeInfoManager.collegeRealNames.get(college.id)}</button
						>
					</li>
				{/each}
			</ul>
		{/if}
	</div>
	{#if collegeInfo != undefined}
		<p>Average SAT - {collegeInfo.CalculatedFields.SATAvg}</p>
		<p>
			Essay required - {collegeInfo.ApplicationDetails.SupplementalRequirements.EssayOrStatement
				.Value}
		</p>
		<p>
			Audition required - {collegeInfo.ApplicationDetails.SupplementalRequirements
				.AuditionOrPortfolioReview.Value}
		</p>
		<p>
			Interview required - {collegeInfo.ApplicationDetails.SupplementalRequirements.Interview.Value}
		</p>
		<p>
			Resume required - {collegeInfo.ApplicationDetails.SupplementalRequirements.Resume.Value}
		</p>
		<p>
			Portfolio required - {collegeInfo.ApplicationDetails.SupplementalRequirements.Portfolio.Value}
		</p>
	{/if}
</div>
