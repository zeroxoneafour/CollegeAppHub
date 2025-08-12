<script lang="ts">
	import type { UserData } from "$lib/userdata.svelte";
	import CollegeDisplay from "./CollegeDisplay.svelte";

    let { userData }: { userData: UserData } = $props();
</script>

<ul class="list w-full">
    {#each userData.colleges as college}
        <li class="list-row w-full">
            <div class="list-col-grow">
                <CollegeDisplay {college} {userData}></CollegeDisplay>
            </div>
        </li>
    {/each}
</ul>