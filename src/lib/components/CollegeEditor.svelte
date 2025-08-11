<script lang="ts">
    import { College, Supplemental, type CollegeInfo, type Value, collegeInfoManager, SupplementalRequired, isSupplementalRequired, SupplementalType } from "$lib/colleges.svelte";
	import userData from "$lib/userdata.svelte";
    let { college }: { college: College } = $props();

    let collegeInfo = $derived(college.collegeInfo);

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

    let totalSupplementals = $derived(requiredSupplementals.length + optionalSupplementals.length + conditionalSupplementals.length);

	function addSupplemental() {
		college.supplementals.push(new Supplemental("", SupplementalType.Essay, ""));
	}

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

<div class="flex flex-col items-center h-fill w-fill gap-10">
    {#if collegeInfo != undefined && (
        collegeInfo.CalculatedFields.SATAvg != 0 ||
        collegeInfo.CalculatedFields.ACTAvg != 0 ||
        collegeInfo.CalculatedFields.AcceptanceRate > 0
    )}
        <div class="flex flex-row gap-10">
            <!-- TAILWIND GENERATE - progress-success progress-warning progress-error -->
            {#if collegeInfo.CalculatedFields.SATAvg !== 0}
                <div>
                    <p class="w-full text-center">Average SAT - {collegeInfo.CalculatedFields.SATAvg}</p>
                    <progress class="progress progress-{satColor} w-full" value={collegeInfo.CalculatedFields.SATAvg} max="1600"
                    ></progress>
                </div>
            {/if}
            {#if collegeInfo.CalculatedFields.ACTAvg !== 0}
                <div>
                    <p class="w-full text-center">Average ACT - {collegeInfo.CalculatedFields.ACTAvg}</p>
                    <progress class="progress progress-{actColor} w-full" value={collegeInfo.CalculatedFields.ACTAvg} max="36"
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
    <div class="flex flex-row gap-10">
        <h1 class="text-4xl">Supplementals</h1>
        <button class="btn" onclick={addSupplemental}>Add Supplemental</button>
    </div>
    {#if collegeInfo !== undefined && totalSupplementals > 0}
        <div class="flex flex-row gap-10">
            {#if requiredSupplementals.length > 0}
                <p class="text-xs">
                    Required - {requiredSupplementals.join(", ")}
                </p>
            {/if}
            {#if optionalSupplementals.length > 0}
                <p class="text-xs">
                    Optional - {optionalSupplementals.join(", ")}
                </p>
            {/if}
            {#if conditionalSupplementals.length > 0}
                <p class="text-xs">
                    Conditional - {conditionalSupplementals.join(", ")}
                </p>
            {/if}
        </div>
    {/if}
    {#if college.supplementals.length > 0}
        <ul class="list">
            {#each college.supplementals as supplemental}
                <li class="list-row">
                    <input
                        class="input"
                        type="text"
                        bind:value={supplemental.name}
                        placeholder="Supplemental name"
                    />
                    <select class="select" bind:value={supplemental.type}>
                        <option disabled selected>Supplemental Type</option>
                        <option value={SupplementalType.Essay}>Essay</option>
                        <option value={SupplementalType.Portfolio}>Portfolio</option>
                        <option value={SupplementalType.Resume}>Resume</option>
                    </select>
                    <input
                        class="list-col-grow input"
                        type="text"
                        bind:value={supplemental.link}
                        placeholder="Supplemental link"
                    />
                    <button
                        aria-label="Delete supplemental"
                        class="btn btn-square self-end"
                        onclick={() => college.supplementals.splice(college.supplementals.indexOf(supplemental), 1)}
                        ><span class="iconify tabler--trash"></span></button
                    >
                </li>
            {/each}
        </ul>
    {/if}
</div>