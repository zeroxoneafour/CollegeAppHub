<script lang="ts">
	import { type College } from "$lib/colleges.svelte";
	import { type PageProps } from "./$types";
	import CollegeEditor from "$lib/components/CollegeEditor.svelte";

	let { params, data }: PageProps = $props();
	let college = data.college!;
</script>

<div class="flex h-full w-full p-10">
	<CollegeEditor {college}></CollegeEditor>
</div>
