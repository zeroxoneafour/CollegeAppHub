<script lang="ts">
	import "../app.css";
	import logo from "$lib/assets/logo.svg";
	import mainUserData from "$lib/userdata.svelte";

	let { children } = $props();

	mainUserData.loadJSON(JSON.parse(window.localStorage.getItem("userData") ?? "{}"));
	$effect(() => {
		window.localStorage.setItem("userData", mainUserData.toString());
	});
</script>

<svelte:head>
	<title>College App Hub</title>
	<link rel="icon" href={logo} />
</svelte:head>

<div class="flex h-screen w-screen flex-col bg-base-100">
	<div class="sticky top-0 z-10 navbar justify-center gap-5 bg-base-100 px-10 shadow-sm">
		<a href="/" class="flex flex-row items-center gap-5">
			<img alt="Logo" src={logo} class="h-10" />
			<p class="text-xl font-semibold">College App Hub</p></a
		>
		<div class="flex-1"></div>
		<a class="btn" href="/addcollege">Add College</a>
		<a href="/calendar" aria-label="Calendar" class="btn btn-square">
			<span class="iconify text-2xl tabler--calendar"></span>
		</a>
		<a href="/settings" aria-label="Settings" class="btn btn-square">
			<span class="iconify text-2xl tabler--settings"></span>
		</a>
	</div>
	<div class="w-full grow-1">
		{@render children?.()}
	</div>
</div>
