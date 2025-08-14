<script lang="ts">
	import { type PageProps } from "./$types";
	import CollegeEditor from "$lib/components/CollegeEditor.svelte";
	import { UserData } from "$lib/userdata.svelte";
	import type { DueDate } from "$lib/colleges.svelte";

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

    let dates = $derived.by(() => {
        let ret = [];
        for (const college of userData.colleges) {
            const collegeName = college.collegeInfo?.Name ?? "Unknown College";
            ret.push(new CollegeDate("Application Due", collegeName, college.dueDate));
            for (const date of college.dates) {
                ret.push(new CollegeDate(date.name, collegeName, date.date));
            }
        }
        return ret;
    });

    function getMonthName(idx: number) {
        return Intl.DateTimeFormat('en', { month: 'long' }).format(new Date(0, idx));
    }
</script>

<div class="flex h-full w-full p-10 gap-10 flex-row">
    {#each { length: 12 }, month}
    {/each}
</div>
