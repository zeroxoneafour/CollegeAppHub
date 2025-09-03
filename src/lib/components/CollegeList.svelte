<script lang="ts">
	import { College } from "$lib/colleges.svelte";
	import { SortOrder, UserData } from "$lib/userdata.svelte";
	import CollegeDisplay from "./CollegeDisplay.svelte";

	let { userData, readonly = false }: { userData: UserData; readonly: boolean } = $props();

	let filterWords = ["the", "university", "institute", "of", "at", "in"];

	let colleges: College[] = $derived.by(() => {
		let colleges = userData.colleges.slice();
		if (userData.collegeSortOrder === SortOrder.Alphabetical) {
			return colleges.sort((a, b) => {
				let aName = a.collegeInfo.name;
				let bName = b.collegeInfo.name;
				aName = aName
					.toLocaleLowerCase()
					.split(" ")
					.filter((x) => !filterWords.includes(x))
					.join(" ");
				bName = bName
					.toLocaleLowerCase()
					.split(" ")
					.filter((x) => !filterWords.includes(x))
					.join(" ");
				return aName.localeCompare(bName);
			});
		} else if (userData.collegeSortOrder === SortOrder.DueDate) {
			let upcoming = colleges.filter((x) => x.dueDate.getTime() >= Date.now());
			let past = colleges.filter((x) => x.dueDate.getTime() < Date.now());
			upcoming.sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
			past.sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
			return upcoming.concat(past);
		} else {
			return colleges;
		}
	});
</script>

<div class="flex w-full flex-col items-center justify-center gap-2 pt-4 md:flex-row">
	<select class="select max-md:w-2/3" bind:value={userData.collegeSortOrder}>
		<option disabled>Sort Colleges</option>
		<option value={SortOrder.Custom}>Custom</option>
		<option value={SortOrder.Alphabetical}>Alphabetical</option>
		<option value={SortOrder.DueDate}>Due Date</option>
	</select>
</div>

<ul class="list w-full">
	{#each colleges as college}
		<li class="list-row w-full">
			<div class="list-col-grow">
				<CollegeDisplay {college} {userData} {readonly}></CollegeDisplay>
			</div>
		</li>
	{/each}
</ul>
