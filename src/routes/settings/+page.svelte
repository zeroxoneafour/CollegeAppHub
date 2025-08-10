<script>
	import userData from "$lib/userdata.svelte";
</script>

<div class="grid grid-cols-2">
	<p>Read Only</p>
	<input class="toggle" type="checkbox" bind:checked={userData.readOnly} />
</div>
