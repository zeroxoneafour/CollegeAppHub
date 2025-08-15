<script lang="ts">
	import { type PageProps } from "./$types";
	import CollegeEditor from "$lib/components/CollegeEditor.svelte";
	import { UserData } from "$lib/userdata.svelte";
	import { dueDateCutoff, dueDateToDate, type DueDate } from "$lib/colleges.svelte";

	let { params, data }: PageProps = $props();
	let userData: UserData = data.userData;

	class CollegeDate {
		name: string;
		collegeName: string;
		date: DueDate;

		constructor(name: string, collegeName: string, date: DueDate) {
			this.name = name;
			this.collegeName = collegeName;
			this.date = date;
		}
	}

	function addCollegeDateToMap(map: Map<number, CollegeDate[]>, date: CollegeDate) {
		const month = date.date.Month - 1;
		if (!map.has(month)) {
			map.set(month, []);
		}
		const arr = map.get(month)!;
		arr.push(date);
	}

	let dates = $derived.by(() => {
		let ret = new Map<number, CollegeDate[]>();
		for (const college of userData.colleges) {
			const collegeName = college.collegeInfo?.Name ?? "Unknown College";
			addCollegeDateToMap(ret, new CollegeDate("Application Due", collegeName, college.dueDate));
			for (const date of college.dates) {
				addCollegeDateToMap(ret, new CollegeDate(date.name, collegeName, date.date));
			}
		}
		return ret;
	});

	let applicationsDue = $derived.by(() => {
		let ret = new Map<number, string[]>();
	});

	function getMonthFromIdx(idx: number): number {
		return (idx + dueDateCutoff - 1) % 12;
	}

	function getMonthName(month: number) {
		return Intl.DateTimeFormat("en", { month: "long" }).format(new Date(0, month));
	}
</script>

<div class="grid h-full w-full grid-cols-6 gap-5 p-10">
	{#each { length: 12 }, idx}
		<div
			class="flex h-full w-full flex-col items-center gap-2 overflow-hidden rounded-sm bg-base-100 p-2 shadow-sm"
		>
			<p class="mb-5">{getMonthName(getMonthFromIdx(idx))}</p>
			<div class="flex w-full grow-1 flex-col gap-2 overflow-scroll">
				{#each dates.get(getMonthFromIdx(idx))! as date}
					<div class="flex-col items-center">
						<p class="text-center">
							{date.name} - {dueDateToDate(date.date).toLocaleDateString()}
						</p>
						<p class="text-center text-xs">{date.collegeName}</p>
					</div>
				{/each}
			</div>
		</div>
	{/each}
</div>
