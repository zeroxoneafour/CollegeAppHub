<script lang="ts">
	import {
		type CollegeInfo,
		type Value,
		SupplementalRequired,
		isSupplementalRequired
	} from "$lib/colleges.svelte";
	import { type UserData } from "$lib/userdata.svelte";

	let {
		collegeInfo,
		userData,
		inline = false
	}: { collegeInfo: CollegeInfo; userData: UserData; inline?: boolean } = $props();

	function getSupplementalsByRequirement(requirement: SupplementalRequired): () => string[] {
		return () => {
			if (collegeInfo == null) return [];
			let supplementalRequirements = collegeInfo.ApplicationDetails.SupplementalRequirements;

			let ret = [];

			const supplementals: [Value, string][] = [
				[supplementalRequirements.EssayOrStatement, "Essay"],
				[supplementalRequirements.Interview, "Interview"],
				[supplementalRequirements.Portfolio, "Portfolio"],
				[supplementalRequirements.AuditionOrPortfolioReview, "Portfolio Review"],
				[supplementalRequirements.Resume, "Resume"]
			];

			for (const [supplemental, text] of supplementals) {
				if (isSupplementalRequired(supplemental) === requirement) {
					ret.push(text);
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
		if (collegeInfo == null) return "";
		if (collegeInfo.CalculatedFields.ACTMin > userData.actScore) return "error";
		else if (collegeInfo.CalculatedFields.ACTMax < userData.actScore) return "success";
		else return "warning";
	});
	let satColor = $derived.by(() => {
		if (collegeInfo == null) return "";
		if (collegeInfo.CalculatedFields.SATMin > userData.satScore) return "error";
		else if (collegeInfo.CalculatedFields.SATMax < userData.satScore) return "success";
		else return "warning";
	});
	let acceptanceRateColor = $derived.by(() => {
		if (collegeInfo == null) return "";
		if (collegeInfo.CalculatedFields.AcceptanceRate > 75) return "success";
		else if (collegeInfo.CalculatedFields.AcceptanceRate < 25) return "error";
		else return "warning";
	});
</script>

<div class="flex w-full flex-row items-center justify-center gap-5 {!inline ? 'md:flex-col' : ''}">
	{#if collegeInfo.CalculatedFields.SATAvg != 0 || collegeInfo.CalculatedFields.ACTAvg != 0 || collegeInfo.CalculatedFields.AcceptanceRate > 0}
		<div class="flex flex-col md:flex-row md:gap-10">
			<!-- TAILWIND GENERATE - progress-success progress-warning progress-error -->
			{#if collegeInfo.CalculatedFields.SATAvg !== 0}
				<div>
					<p class="w-full text-center">Average SAT - {collegeInfo.CalculatedFields.SATAvg}</p>
					<progress
						class="progress progress-{satColor} w-full"
						value={collegeInfo.CalculatedFields.SATAvg - 800}
						max="800"
					></progress>
				</div>
			{/if}
			{#if collegeInfo.CalculatedFields.ACTAvg !== 0}
				<div>
					<p class="w-full text-center">Average ACT - {collegeInfo.CalculatedFields.ACTAvg}</p>
					<progress
						class="progress progress-{actColor} w-full"
						value={collegeInfo.CalculatedFields.ACTAvg - 14}
						max="22"
					></progress>
				</div>
			{/if}
			{#if collegeInfo.CalculatedFields.AcceptanceRate > 0}
				<div>
					<p class="w-full text-center">
						Acceptance Rate - {collegeInfo.CalculatedFields.AcceptanceRate.toFixed(2)}%
					</p>
					<progress
						class="progress progress-{acceptanceRateColor} w-full"
						value={collegeInfo.CalculatedFields.AcceptanceRate}
						max="100"
					></progress>
				</div>
			{/if}
		</div>
	{/if}
	{#if totalSupplementals > 0}
		<div class="flex flex-col items-center justify-center {inline ? "gap-2" : "gap-10"} md:flex-row">
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
