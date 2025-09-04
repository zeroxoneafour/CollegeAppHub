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
	$effect(() => {
		if (!$effect.tracking()) return;
		mainUserData.colleges;
		mainUserData.lastModifiedTime = Date.now();
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
	<div
		class="sticky top-0 z-10 navbar justify-center gap-2 bg-base-100 px-10 pr-4 pl-4 shadow-sm sm:gap-5"
	>
		<a href="/" class="flex flex-row items-center gap-5" title="Homepage">
			<img alt="Logo" src={logo} class="h-10" />
			<p class="hidden text-xl font-semibold sm:inline">College App Hub</p></a
		>
		<div class="flex-1"></div>
		<a class="btn max-md:btn-square" href="/addcollege">
			<p class="hidden md:inline">Add College</p>
			<span class="iconify text-2xl tabler--plus md:hidden" title="Add College"></span>
		</a>
		<a href="/calendar" aria-label="Calendar" title="Calendar" class="btn btn-square">
			<span class="iconify text-2xl tabler--calendar"></span>
		</a>
		<a href="/settings" aria-label="Settings" title="Settings" class="btn btn-square">
			<span class="iconify text-2xl tabler--settings"></span>
		</a>
		{#if firebaseManager.user != null}
			<button
				class="btn btn-square"
				aria-label="Upload"
				title="Upload Data"
				onclick={() => firebaseManager.uploadMainUserData()}
			>
				<span class="iconify text-2xl tabler--world-up"></span>
			</button>
			<button
				class="btn btn-square"
				aria-label="Download"
				title="Download Data"
				onclick={() => firebaseManager.downloadMainUserData()}
			>
				<span class="iconify text-2xl tabler--world-down"></span>
			</button>
		{:else}
			<a href="/login" aria-label="Login" title="Login" class="btn btn-square">
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
