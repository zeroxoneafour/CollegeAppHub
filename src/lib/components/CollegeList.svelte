<script lang="ts">
	import type { UserData } from "$lib/userdata.svelte";
	import CollegeDisplay from "./CollegeDisplay.svelte";

    let { userData }: { userData: UserData } = $props();
</script>

<ul class="w-full">
    {#each userData.colleges as college}
        <li class="w-full">
            <CollegeDisplay {college} {userData}></CollegeDisplay>
        </li>
    {/each}
</ul>