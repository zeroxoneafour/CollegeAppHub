<script lang="ts">
	import { dueDateToDate, type DueDate } from "$lib/colleges.svelte";

    let { date = $bindable() }: { date: DueDate } = $props();

    function dueDateToString(dueDate: DueDate): string {
        const date = dueDateToDate(dueDate);
        const year = String(date.getFullYear()).padStart(4, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return [year, month, day].join("-");
    }
    function dueDateFromString(str: string): DueDate {
        let arr = str.split("-").map(x => Number(x));
        return {
            Month: arr[1],
            Day: arr[2]
        };
    }
</script>

<input type="date" class="input" bind:value={() => dueDateToString(date), (v) => (date = dueDateFromString(v))} />