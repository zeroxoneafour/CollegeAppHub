<script lang="ts">
	import { ApplicationStatus, College, SupplementalType } from "$lib/colleges.svelte";
	import { type UserData } from "$lib/userdata.svelte";
	import CollegeStats from "./CollegeStats.svelte";

	let {
		college,
		userData,
		readonly = false
	}: { college: College; userData: UserData; readonly: boolean } = $props();
	let collegeIndex = userData.colleges.indexOf(college);
	let collegeInfo = $derived(college.collegeInfo);

	let collegeInfoOpen = $state(false);
	let collegeDeleteMenuOpen = $state(false);
	function deleteCollege() {
		collegeDeleteMenuOpen = false;
		userData.colleges.splice(collegeIndex, 1);
	}
	// required for displaying things over other collegedisplays (ex. tooltips)
	let isFocused = $state(false);

	let accentColor = $derived.by(() => {
		switch (college.status) {
			case ApplicationStatus.Pending:
				return "base-300";
			case ApplicationStatus.Accepted:
				return "success";
			case ApplicationStatus.Rejected:
				return "error";
			case ApplicationStatus.Deferred:
				return "warning";
			case ApplicationStatus.Committed:
				return "info";
		}
	});

	let essaySupplementals = $derived(
		college.supplementals.filter((x) => x.type == SupplementalType.Essay)
	);
	let portfolioSupplementals = $derived(
		college.supplementals.filter((x) => x.type == SupplementalType.Portfolio)
	);
	let resumeSupplementals = $derived(
		college.supplementals.filter((x) => x.type == SupplementalType.Resume)
	);

	let dueDate = $derived(college.dueDate.toLocaleDateString());
</script>

<!-- TAILWIND bg-base-300 bg-info bg-success bg-warning bg-error -->
<div class="flex w-full flex-row rounded-sm bg-{accentColor} {isFocused ? 'z-10' : ''}">
	<!-- DO NOT REMOVE - shows status -->
	<div class="h-full w-1"></div>
	<details
		class="collapse-arrow collapse grow-1 overflow-visible rounded-none border border-base-300 bg-base-100"
		onfocusin={() => (isFocused = true)}
		onfocusout={() => (isFocused = false)}
		open
	>
		<summary class="collapse-title flex flex-row">
			<div class="flex w-full flex-row items-center gap-2">
				<p class="h-full justify-center font-semibold">
					{collegeInfo.name != "" ? collegeInfo.name : "Unknown College"}
				</p>
				<div class="grow-1"></div>
				{#if collegeInfo != null}
					<details class="dropdown dropdown-left" bind:open={collegeInfoOpen}>
						<summary onblur={() => (collegeInfoOpen = false)}>
							<div class="btn btn-square btn-sm">
								<span class="iconify tabler--info-circle"></span>
							</div>
						</summary>
						<div class="dropdown-content pointer-events-none z-10 w-150 bg-base-100 p-2 shadow-sm">
							<CollegeStats {collegeInfo} {userData} inline={true}></CollegeStats>
						</div>
					</details>
				{/if}
				{#if !readonly}
					<a
						class="btn btn-square btn-sm"
						href="/editcollege?index={collegeIndex}"
						aria-label="Edit college"><span class="iconify tabler--pencil"></span></a
					>
					<details class="dropdown dropdown-left" bind:open={collegeDeleteMenuOpen}>
						<summary>
							<div class="btn btn-square btn-sm">
								<span class="iconify tabler--trash"></span>
							</div>
						</summary>
						<button class="dropdown-content btn z-10 mr-2 w-50" onclick={deleteCollege}
							>Really delete?</button
						>
					</details>
				{/if}
			</div>
		</summary>
		<div class="collapse-content flex flex-row">
			<div class="flex flex-row items-center gap-8">
				{#if college.applicationLink != ""}
					<a class="btn" href={college.applicationLink} target="_blank">Application Link</a>
				{/if}
				<div class="flex flex-col items-center">
					<p>Due Date</p>
					<p>{dueDate}</p>
				</div>
				<div class="flex flex-col items-center">
					<p>Application Status</p>
					<select class="select" bind:value={college.status} disabled={readonly}>
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
								<a class="link link-hover" target="_blank" href={supplemental.link}
									>{supplemental.name}</a
								>
							{/each}
						</div>
					{/if}
					{#if resumeSupplementals.length > 0}
						<div class="flex flex-row gap-2">
							<p>Resumes -</p>
							{#each resumeSupplementals as supplemental}
								<a class="link link-hover" target="_blank" href={supplemental.link}
									>{supplemental.name}</a
								>
							{/each}
						</div>
					{/if}
					{#if portfolioSupplementals.length > 0}
						<div class="flex flex-row gap-2">
							<p>Portfolios -</p>
							{#each portfolioSupplementals as supplemental}
								<a class="link link-hover" target="_blank" href={supplemental.link}
									>{supplemental.name}</a
								>
							{/each}
						</div>
					{/if}
				</div>
				{#each college.dates as date}
					<div class="flex flex-col items-center justify-center">
						<p>{date.name} -</p>
						<p>{date.date.toLocaleDateString()}</p>
					</div>
				{/each}
			</div>
		</div>
	</details>
</div>
