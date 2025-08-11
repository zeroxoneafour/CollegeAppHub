<script lang="ts">
	import { College } from "$lib/colleges.svelte";

    let { college }: { college: College } = $props();
    let collegeInfo = $derived(college.collegeInfo);
</script>

<div>
    <p>{collegeInfo != null ? collegeInfo.Name : "unknown college"}</p>
</div>