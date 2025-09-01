<script lang="ts">
	import { CollegeInfo, SupplementalRequired } from "$lib/collegeinfo.svelte";
	import { UserData } from "$lib/userdata.svelte";

	let {
		collegeInfo,
		userData,
		inline = false
	}: { collegeInfo: CollegeInfo; userData: UserData; inline?: boolean } = $props();

	function getSupplementalsByRequirement(requirement: SupplementalRequired): () => string[] {
		return () => {
			if (collegeInfo.requiredSupplementals == null) return [];

			let ret = [];

			for (const [key, value] of Object.entries(collegeInfo.requiredSupplementals)) {
				if (value === requirement) {
					// https://stackoverflow.com/questions/4149276/how-to-convert-camelcase-to-camel-case
					ret.push(key.replace(/([A-Z])/g, " $1").replace(/^./, (x) => x.toUpperCase()));
				}
			}

			return ret;
		};
	}

	const requiredSupplementals = $derived.by(
		getSupplementalsByRequirement(SupplementalRequired.Required)
	);
	const optionalSupplementals = $derived.by(
		getSupplementalsByRequirement(SupplementalRequired.Optional)
	);
	const conditionalSupplementals = $derived.by(
		getSupplementalsByRequirement(SupplementalRequired.Conditional)
	);

	let totalSupplementals = $derived(
		requiredSupplementals.length + optionalSupplementals.length + conditionalSupplementals.length
	);

	let actColor = $derived.by(() => {
		if (collegeInfo.actScore == null) return "";
		if (collegeInfo.actScore[0] > userData.actScore) return "error";
		else if (collegeInfo.actScore[2] < userData.actScore) return "success";
		else return "warning";
	});
	let satColor = $derived.by(() => {
		if (collegeInfo.satScore == null) return "";
		if (collegeInfo.satScore[0] > userData.satScore) return "error";
		else if (collegeInfo.satScore[2] < userData.satScore) return "success";
		else return "warning";
	});
	let acceptanceRateColor = $derived.by(() => {
		if (collegeInfo.acceptanceRate == null) return "";
		if (collegeInfo.acceptanceRate > 75) return "success";
		else if (collegeInfo.acceptanceRate < 25) return "error";
		else return "warning";
	});
</script>

<div class="flex w-full flex-row items-center justify-center gap-5 {!inline ? 'md:flex-col' : ''}">
	{#if collegeInfo.satScore || collegeInfo.actScore || collegeInfo.acceptanceRate}
		<div class="flex flex-col md:flex-row md:gap-10">
			<!-- TAILWIND GENERATE - progress-success progress-warning progress-error -->
			{#if collegeInfo.satScore}
				<div>
					<p class="w-full text-center">Average SAT - {collegeInfo.satScore[1]}</p>
					<progress
						class="progress progress-{satColor} w-full"
						value={collegeInfo.satScore[1] - 800}
						max="800"
					></progress>
				</div>
			{/if}
			{#if collegeInfo.actScore}
				<div>
					<p class="w-full text-center">Average ACT - {collegeInfo.actScore[1]}</p>
					<progress
						class="progress progress-{actColor} w-full"
						value={collegeInfo.actScore[1] - 14}
						max="22"
					></progress>
				</div>
			{/if}
			{#if collegeInfo.acceptanceRate}
				<div>
					<p class="w-full text-center">
						Acceptance Rate - {collegeInfo.acceptanceRate.toFixed(2)}%
					</p>
					<progress
						class="progress progress-{acceptanceRateColor} w-full"
						value={collegeInfo.acceptanceRate}
						max="100"
					></progress>
				</div>
			{/if}
		</div>
	{/if}
	{#if totalSupplementals > 0}
		<div
			class="flex flex-col items-center justify-center {inline ? 'gap-2' : 'gap-10'} md:flex-row"
		>
			{#if requiredSupplementals.length > 0}
				<p class="text-center text-xs">
					Required- {requiredSupplementals.join(", ")}
				</p>
			{/if}
			{#if optionalSupplementals.length > 0}
				<p class="text-center text-xs">
					Optional- {optionalSupplementals.join(", ")}
				</p>
			{/if}
			{#if conditionalSupplementals.length > 0}
				<p class="text-center text-xs">
					Conditional- {conditionalSupplementals.join(", ")}
				</p>
			{/if}
		</div>
	{/if}
</div>
