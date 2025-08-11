<script lang="ts">
	import { College } from "$lib/colleges.svelte";

    let { college }: { college: College } = $props();
    let collegeInfo = $derived(college.collegeInfo);
</script>

<details class="collapse bg-base-100 border-base-300 border" open>
    <summary class="collapse-title font-semibold">{collegeInfo != null ? collegeInfo.Name : "unknown college"}</summary>
    <div class="collapse-content text-sm">
        {#each college.supplementals as supplemental}
            <a class="btn" href={supplemental.link}>{supplemental.name}</a>
        {/each}
    </div>
</details>