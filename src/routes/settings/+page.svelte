<script lang="ts">
	import userData from "$lib/userdata.svelte";

	let configText: string = $state("");
	let configElement: HTMLInputElement | undefined = $state();
</script>

<div class="flex h-full w-full flex-col items-center justify-center gap-5">
	<div class="grid grid-cols-2 gap-2">
		<p class="flex h-full items-center">Read Only</p>
		<input class="toggle" type="checkbox" bind:checked={userData.readOnly} />
		<p class="flex h-full items-center">ACT Score</p>
		<input type="number" class="input" min="1" max="36" bind:value={userData.actScore} />
		<p class="flex h-full items-center">SAT Score</p>
		<input type="number" class="input" min="1" max="1600" bind:value={userData.satScore} />
	</div>
	<div class="flex flex-col items-center justify-center gap-2">
		<p>Enter a config, or copy yours from below</p>
		<input class="input" type="text" bind:value={configText} bind:this={configElement} />
		<div class="flex flex-row gap-2">
			<button
				class="btn"
				onclick={() => {
					configText = userData.toString();
					if (configElement !== undefined) configElement.select();
				}}>Export config</button
			>
			<button class="btn" onclick={() => userData.loadUserData(configText)}>Import config</button>
		</div>
	</div>
</div>
