<script lang="ts">
	// valid types - number, threenumber, string
	let { name, type, value = $bindable() }: { name: string; type: string; value: any } = $props();
</script>

<div class="flex flex-row items-center gap-2">
	<p>{name}</p>
	<input
		class="checkbox"
		type="checkbox"
		bind:checked={
			() => value !== null,
			(v) => {
				if (v === true) {
					if (value == null) {
						if (type === "number") {
							value = 0;
						} else if (type === "threenumber") {
							value = [0, 0, 0];
						} else if (type === "string") {
							value = "";
						}
					}
				} else {
					value = null;
				}
			}
		}
	/>
	<div class="grow-1">
		{#if value != null}
			{#if type === "threenumber"}
				<div class="flex flex-row">
					<input class="input w-20" bind:value={() => value[0], (v) => (value[0] = Number(v))} />
					<input class="input w-20" bind:value={() => value[1], (v) => (value[1] = Number(v))} />
					<input class="input w-20" bind:value={() => value[2], (v) => (value[2] = Number(v))} />
				</div>
			{:else if type === "number"}
				<input class="input" bind:value={() => value, (v) => (value = Number(v))} />
			{:else if type === "string"}
				<input class="input" bind:value />
			{:else}
				<p>Error displaying editor</p>
			{/if}
		{/if}
	</div>
</div>
