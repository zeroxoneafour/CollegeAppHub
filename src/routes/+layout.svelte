<script lang="ts">
	import "../app.css";
	import logo from "$lib/assets/logo.svg";
	import mainUserData from "$lib/userdata.svelte";
	import firebaseManager from "$lib/firebase.svelte";
	import logger, { LogSeverity } from "$lib/log.svelte";

	let { children } = $props();

	mainUserData.loadJSON(JSON.parse(window.localStorage.getItem("userData") ?? "{}"));
	$effect(() => {
		window.localStorage.setItem("userData", mainUserData.toString());
	});

	let alertColor = $derived.by(() => {
		if (logger.currentMessage == null) return "";
		else if (logger.currentMessage.severity == LogSeverity.Error) return "alert-error";
		else if (logger.currentMessage.severity == LogSeverity.Warning) return "alert-warning";
		else if (logger.currentMessage.severity == LogSeverity.Info) return "alert-info";
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
		{#if firebaseManager.user != null}
			<details class="dropdown dropdown-end">
				<summary class="btn btn-square"
					><span class="iconify text-2xl tabler--world-up"></span></summary
				>
				<ul class="dropdown-content menu z-1 w-52 rounded-box bg-base-100 p-2 shadow-sm">
					<li><button onclick={() => firebaseManager.uploadMainUserData()}>Upload</button></li>
					<li><button onclick={() => firebaseManager.downloadMainUserData()}>Download</button></li>
				</ul>
			</details>
		{:else}
			<a href="/login" aria-label="Login" class="btn btn-square">
				<span class="iconify text-2xl tabler--user-circle"></span>
			</a>
		{/if}
	</div>
	<div class="w-full grow-1">
		{@render children?.()}
	</div>
	{#if logger.currentMessage != null}
		<div class="absolute bottom-0 w-full p-2">
			<!-- TAILWIND alert-info alert-warning alert-error -->
			<div role="alert" class="alert {alertColor} w-full">
				{logger.currentMessage.message}
			</div>
		</div>
	{/if}
</div>
