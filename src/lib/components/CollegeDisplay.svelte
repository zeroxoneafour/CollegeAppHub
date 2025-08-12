<script lang="ts">
	import { ApplicationStatus, College } from "$lib/colleges.svelte";
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
	})
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
						onfocusout={() => (collegeInfoOpen = false)}
					>
						<summary>
							<div class="btn btn-square btn-sm">
								<span class="iconify tabler--info-circle"></span>
							</div>
						</summary>
						<div class="dropdown-content z-10 bg-base-100 shadow-sm p-2">
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
					<button
						aria-label="Delete college"
						class="btn btn-square btn-sm"
						onclick={() => userData.colleges.splice(collegeIndex, 1)}
						><span class="iconify tabler--trash"></span></button
					>
				{/if}
			</div>
		</summary>
		<div class="collapse-content text-sm">
			{#each college.supplementals as supplemental}
				<a class="btn" href={supplemental.link}>{supplemental.name}</a>
			{/each}
		</div>
	</details>
</div>