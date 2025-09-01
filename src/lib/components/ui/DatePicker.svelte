<script lang="ts">
	let { date = $bindable() }: { date: Date } = $props();

	function dateToString(date: Date): string {
		const year = String(date.getFullYear()).padStart(4, "0");
		const month = String(date.getMonth() + 1).padStart(2, "0");
		const day = String(date.getDate()).padStart(2, "0");
		return [year, month, day].join("-");
	}
	function dateFromString(str: string): Date {
		let arr = str.split("-").map((x) => Number(x));
		return new Date(arr[0], arr[1] - 1, arr[2]);
	}
</script>

<input
	type="date"
	class="input"
	bind:value={() => dateToString(date), (v) => (date = dateFromString(v))}
/>
