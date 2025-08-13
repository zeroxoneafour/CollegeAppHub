<script lang="ts">
	import type { DueDate } from "$lib/colleges.svelte";

    let { date = $bindable() }: { date: DueDate } = $props();
</script>

<input type="date" class="input" bind:value={date}/>