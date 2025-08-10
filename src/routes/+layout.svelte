<script lang="ts">
	import "../app.css";
	import favicon from "$lib/assets/favicon.svg";
	import userData, { saveUserData } from "$lib/userdata.svelte";

	let { children } = $props();

	$effect(() => {
		saveUserData(userData);
	});
</script>

<svelte:head>
	<title>College App Hub</title>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="h-screen w-screen bg-base-100">
	<div class="navbar justify-center gap-10 bg-base-100 px-10 shadow-sm">
		<a href="/" class="text-xl font-semibold">College App Hub</a>
		<div class="flex-1"></div>
		<a class="btn" href="/addcollege">Add College</a>
		<a href="/settings" aria-label="Settings" class="btn btn-square"
			><span class="iconify text-2xl tabler--settings"></span></a
		>
	</div>
	{@render children?.()}
</div>
