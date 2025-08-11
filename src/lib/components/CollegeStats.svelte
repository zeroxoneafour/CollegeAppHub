<script lang="ts">
	import type { CollegeInfo } from "$lib/colleges.svelte";

    let { collegeInfo }: { collegeInfo: CollegeInfo } = $props();

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