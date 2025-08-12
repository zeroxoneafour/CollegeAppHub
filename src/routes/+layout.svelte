<script lang="ts">
	import "../app.css";
	import favicon from "$lib/assets/favicon.svg";
	import userData from "$lib/userdata.svelte";

	let { children } = $props();

	userData.loadLocalStorage();
	$effect(() => {
		userData.saveLocalStorage();
	});
</script>

<svelte:head>
	<title>College App Hub</title>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="flex h-screen w-screen flex-col bg-base-100">
	<div class="sticky top-0 z-10 navbar justify-center gap-10 bg-base-100 px-10 shadow-sm">
		<a href="/" class="text-xl font-semibold">College App Hub</a>
		<div class="flex-1"></div>
		<a class="btn" href="/addcollege">Add College</a>
		<a href="/settings" aria-label="Settings" class="btn btn-square"
			><span class="iconify text-2xl tabler--settings"></span></a
		>
	</div>
	<div class="grow-1">
		{@render children?.()}
	</div>
</div>
