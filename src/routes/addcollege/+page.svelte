<script lang="ts">
	import { collegeInfoManager, CollegeInfo } from "$lib/collegeinfo.svelte";
	import { College } from "$lib/colleges.svelte";
	import { goto } from "$app/navigation";
	import CollegeEditor from "$lib/components/CollegeEditor.svelte";
	import mainUserData from "$lib/userdata.svelte";
	import CollegeStats from "$lib/components/CollegeStats.svelte";

	let collegeSearch = $state("");
	let collegeSearchBar: HTMLInputElement = $state()!;
	let collegeSearchResults = $derived.by(() => {
		return collegeInfoManager.getCollegeIdPairs(collegeSearch.toLocaleLowerCase());
	});

	let college: College | undefined = $state();
	let collegeInfo: CollegeInfo | null = $derived(college?.collegeInfo ?? null);

	function setCollegeId(id: number) {
		collegeSearch = collegeInfoManager.collegeRealNames.get(id)!;
		college = new College(new CollegeInfo(id));
	}

	function addCollege() {
		if (college != undefined) {
			mainUserData.colleges.push(college);
		}
		goto("/");
	}
</script>

<div class="flex h-full w-full flex-col items-center gap-10 p-10">
	<p class="text-4xl">New College</p>
	<div class="dropdown dropdown-center w-1/3 min-w-80">
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
	{#if college != undefined}
		{#if collegeInfo != null}
			<CollegeStats {collegeInfo} userData={mainUserData}></CollegeStats>
		{/if}
		<CollegeEditor {college} userData={mainUserData}></CollegeEditor>
		<button class="btn" onclick={addCollege}>Add College</button>
	{:else}
		<a class="btn" href="/">Back</a>
	{/if}
</div>
