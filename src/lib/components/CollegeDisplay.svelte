<script lang="ts">
	import { ApplicationStatus, College, SupplementalType } from "$lib/colleges.svelte";
	import { SortOrder, type UserData } from "$lib/userdata.svelte";
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
		if (!collegeDeleteMenuOpen) {
			collegeDeleteMenuOpen = true;
			return;
		}
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

	function moveCollegeUp() {
		if (collegeIndex <= 0) return;
		let colleges = userData.colleges.slice();
		colleges.splice(collegeIndex, 1);
		colleges.splice(collegeIndex - 1, 0, college);
		userData.colleges = colleges;
	}
	function moveCollegeDown() {
		if (collegeIndex >= userData.colleges.length - 1) return;
		let colleges = userData.colleges.slice();
		colleges.splice(collegeIndex, 1);
		colleges.splice(collegeIndex + 1, 0, college);
		userData.colleges = colleges;
	}
</script>

<!-- TAILWIND bg-base-300 bg-info bg-success bg-warning bg-error -->
<div class="flex w-full flex-row rounded-sm bg-{accentColor} {isFocused ? 'z-10' : ''}">
	<!-- DO NOT REMOVE - shows status -->
	<div class="pointer-events-none h-full w-1"></div>
	<details
		class="collapse-arrow collapse grow-1 overflow-visible rounded-none border border-base-300 bg-base-100"
		onfocusin={() => (isFocused = true)}
		onfocusout={() => (isFocused = false)}
		open
	>
		<summary class="collapse-title flex flex-row">
			<div class="flex w-full flex-row gap-2">
				{#if college.applicationLink != ""}
					<a
						class="h-full link justify-center font-semibold link-hover"
						href={college.applicationLink}
						target="_blank">{collegeInfo.name != "" ? collegeInfo.name : "Unknown College"}</a
					>
				{:else}
					<p class="h-full justify-center font-semibold">
						{collegeInfo.name != "" ? collegeInfo.name : "Unknown College"}
					</p>
				{/if}
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
			</div>
		</summary>
		<div class="collapse-content flex w-full flex-col items-center gap-4 md:flex-row lg:gap-10">
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
			<div class="flex flex-col gap-2">
				{#if essaySupplementals.length > 0}
					<div class="flex flex-col items-center md:flex-row md:gap-2">
						<p>Essays -</p>
						{#each essaySupplementals as supplemental}
							<a class="link text-center link-hover" target="_blank" href={supplemental.link}
								>{supplemental.name}</a
							>
						{/each}
					</div>
				{/if}
				{#if resumeSupplementals.length > 0}
					<div class="flex flex-col items-center md:flex-row md:gap-2">
						<p>Resumes -</p>
						{#each resumeSupplementals as supplemental}
							<a class="link text-center link-hover" target="_blank" href={supplemental.link}
								>{supplemental.name}</a
							>
						{/each}
					</div>
				{/if}
				{#if portfolioSupplementals.length > 0}
					<div class="flex flex-col items-center md:flex-row md:gap-2">
						<p>Portfolios -</p>
						{#each portfolioSupplementals as supplemental}
							<a class="link text-center link-hover" target="_blank" href={supplemental.link}
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
			{#if !readonly}
				<div class="flex-1"></div>
				<div class="flex flex-row gap-1 md:max-lg:flex-col">
					<a
						class="btn btn-square btn-sm"
						href="/editcollege?index={collegeIndex}"
						aria-label="Edit college"><span class="iconify tabler--pencil"></span></a
					>
					<details class="dropdown dropdown-left" bind:open={collegeDeleteMenuOpen}>
						<summary>
							<button
								class="btn btn-square btn-sm"
								onclick={deleteCollege}
								aria-label="Delete college"
								onblur={() => (collegeDeleteMenuOpen = false)}
							>
								<span class="iconify tabler--trash"></span>
							</button>
						</summary>
						<p class="dropdown-content z-10 mr-2 w-50 bg-base-100 text-center shadow-sm">
							Really delete? Press trash again to confirm
						</p>
					</details>
					{#if userData.collegeSortOrder === SortOrder.Custom}
						<button
							class="btn btn-square btn-sm"
							aria-label="Move college up"
							onclick={moveCollegeUp}><span class="iconify tabler--arrow-up"></span></button
						>
						<button
							class="btn btn-square btn-sm"
							aria-label="Move college down"
							onclick={moveCollegeDown}><span class="iconify tabler--arrow-down"></span></button
						>
					{/if}
				</div>
			{/if}
		</div>
	</details>
</div>
