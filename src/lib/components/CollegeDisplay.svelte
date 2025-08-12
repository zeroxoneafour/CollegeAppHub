<script lang="ts">
	import { ApplicationStatus, College, SupplementalType } from "$lib/colleges.svelte";
	import { type UserData } from "$lib/userdata.svelte";
	import CollegeStats from "./CollegeStats.svelte";

	let { college, userData }: { college: College; userData: UserData } = $props();
	let collegeIndex = userData.colleges.indexOf(college);
	let collegeInfo = $derived(college.collegeInfo);

	let collegeInfoOpen = $state(false);
	// required for displaying things over other collegedisplays (ex. tooltips)
	let isFocused = $state(false);

	let accentColor = $derived.by(() => {
		switch (college.status) {
			case ApplicationStatus.Pending: return "base-300";
			case ApplicationStatus.Accepted: return "success";
			case ApplicationStatus.Rejected: return "error";
			case ApplicationStatus.Deferred: return "warning";
			case ApplicationStatus.Committed: return "info";
		}
	});

	let essaySupplementals = $derived(college.supplementals.filter((x) => x.type == SupplementalType.Essay));
	let portfolioSupplementals = $derived(college.supplementals.filter((x) => x.type == SupplementalType.Portfolio));
	let resumeSupplementals = $derived(college.supplementals.filter((x) => x.type == SupplementalType.Resume));
</script>

<!-- TAILWIND bg-base-300 bg-info bg-success bg-warning bg-error -->
<div class="flex flex-row w-full rounded-sm bg-{accentColor} {isFocused ? 'z-10': ''}">
	<div class="h-full w-1"></div>
	<details
		class="collapse-arrow collapse overflow-visible border border-base-300 bg-base-100 grow-1 rounded-none"
		onfocusin={() => (isFocused = true)}
		onfocusout={() => (isFocused = false)}
		open
	>
		<summary class="collapse-title flex flex-row">
			<div class="flex w-full flex-row items-center gap-2">
				<p class="h-full justify-center font-semibold">
					{collegeInfo != null ? collegeInfo.Name : "unknown college"}
				</p>
				<div class="grow-1"></div>
				{#if collegeInfo != null}
					<details
						class="dropdown dropdown-left"
						bind:open={collegeInfoOpen}
					>
						<summary onblur={() => (collegeInfoOpen = false)}>
							<div class="btn btn-square btn-sm">
								<span class="iconify tabler--info-circle"></span>
							</div>
						</summary>
						<div class="dropdown-content z-10 bg-base-100 w-150 shadow-sm p-2 pointer-events-none">
							<CollegeStats {collegeInfo} {userData} inline={true}></CollegeStats>
						</div>
					</details>
				{/if}
				{#if !userData.readOnly}
					<a
						class="btn btn-square btn-sm"
						href="/editcollege?index={collegeIndex}"
						aria-label="Edit college"><span class="iconify tabler--pencil"></span></a
					>
					<details class="dropdown dropdown-left">
						<summary>
							<div class="btn btn-square btn-sm">
								<span class="iconify tabler--trash"></span>
							</div>
						</summary>
						<button class="btn dropdown-content z-10 w-50" onclick={() => userData.colleges.splice(collegeIndex, 1)}>Really delete?</button>
					</details>
				{/if}
			</div>
		</summary>
		<div class="collapse-content flex flex-row">
			<div class="flex flex-row items-center gap-5">
				{#if college.applicationLink != ""}
					<a class="btn" href={college.applicationLink} target="_blank">Application Link</a>
				{/if}
				<div class="flex flex-col items-center">
					<p>Application Status</p>
					<select class="select" bind:value={college.status}>
						<option value={ApplicationStatus.Accepted}>Accepted</option>
						<option value={ApplicationStatus.Committed}>Committed</option>
						<option value={ApplicationStatus.Deferred}>Deferred</option>
						<option value={ApplicationStatus.Rejected}>Rejected</option>
						<option value={ApplicationStatus.Pending}>Pending</option>
					</select>
				</div>
				<div class="flex flex-col">
					{#if essaySupplementals.length > 0}
						<div class="flex flex-row gap-2">
							<p>Essays -</p>
							{#each essaySupplementals as supplemental}
								<a class="link link-hover" target="_blank" href={supplemental.link}>{supplemental.name}</a>
							{/each}
						</div>
					{/if}
					{#if resumeSupplementals.length > 0}
						<div class="flex flex-row gap-2">
							<p>Resumes -</p>
							{#each resumeSupplementals as supplemental}
								<a class="link link-hover" target="_blank" href={supplemental.link}>{supplemental.name}</a>
							{/each}
						</div>
					{/if}
					{#if portfolioSupplementals.length > 0}
						<div class="flex flex-row gap-2">
							<p>Portfolios -</p>
							{#each portfolioSupplementals as supplemental}
								<a class="link link-hover" target="_blank" href={supplemental.link}>{supplemental.name}</a>
							{/each}
						</div>
					{/if}
				</div>
			</div>
		</div>
	</details>
</div>