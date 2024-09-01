<script lang="ts">
    import type { Killmail } from '../types/Killmail';
    import { onMount } from 'svelte';
    import { fetchKillList } from '$lib/fetchKillList.ts';
    import { formatNumber } from '$lib/Helpers.ts';
    import involvedImage from '../images/involved.png';

    export let url: string;
    export let title: string = '';

    let kills: Killmail[] = [];
    let page: number = 1;
    let loading: boolean = false;

    // Check for page number in the URL when the component is mounted
    onMount(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const pageParam = urlParams.get('killlistPage');
        if (pageParam) {
            page = parseInt(pageParam, 10);
        }
        loadKills();
    });

    async function loadKills() {
        if (loading) return;
        loading = true;
        const newKills: Killmail[] = await fetchKillList(url, page);
        kills = newKills;  // Load the kills without filtering by killmailIds
        updateURL();       // Update the URL with the current page
        loading = false;
    }

    function changePage(newPage: number) {
        if (newPage > 0) {
            page = newPage;
            loadKills();
        }
    }

    function updateURL() {
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.set('killlistPage', String(page));
        history.pushState({}, '', newUrl);
    }

    function truncateString(str: any, num: number) {
        let stringifiedStr = String(str);
        return stringifiedStr.length <= num ? stringifiedStr : stringifiedStr.slice(0, num) + '...';
    }
</script>

{#if title !== undefined}
    <h1 class="text-white">{title}</h1>
{/if}

<!-- Pagination Control at the Top -->
<div class="flex justify-between items-center mb-4">
    <button
        on:click={() => changePage(page - 1)}
        disabled={page === 1 || loading}
        class="px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-md hover:bg-gray-700 disabled:opacity-50"
    >
        Previous
    </button>
    <span class="text-white">Page {page}</span>
    <button
        on:click={() => changePage(page + 1)}
        disabled={loading}
        class="px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-md hover:bg-gray-700 disabled:opacity-50"
    >
        Next
    </button>
</div>

<div class="overflow-x-auto" role="table">
    <table class="table-auto min-w-full bg-semi-transparent bg-gray-800 rounded-lg shadow-lg">
        <thead>
            <tr class="bg-darker text-white uppercase text-xs leading-normal">
                <th class="px-2 py-1 w-[64px]" scope="col"></th>
                <th class="px-2 py-1" scope="col">Ship</th>
                <th class="px-2 py-1 w-[64px]" scope="col"></th>
                <th class="px-2 py-1" scope="col">Victim</th>
                <th class="px-2 py-1" scope="col">Final Blow</th>
                <th class="px-2 py-1" scope="col">Location</th>
            </tr>
        </thead>

        <tbody class="text-gray-300 text-sm">
            {#each kills as kill (kill.killmail_id)}
                <tr
                    class="border-b border-gray-700 hover:bg-gray-600 transition-colors duration-300"
                    on:click={() => { window.location.href = `/kill/${kill.killmail_id}`; }}
                >
                    <td class="px-2 py-1">
                        <img
                            src="{kill.victim.ship_image_url}?size=64"
                            alt="Ship: {kill.victim.ship_name}"
                            class="w-10 rounded"
                        />
                    </td>
                    <td class="px-2 py-1">
                        {truncateString(kill.victim.ship_name, 20)}<br />
                        {#if kill.total_value > 50}
                            <span class="text-gray-400">{formatNumber(kill.total_value)} ISK</span>
                        {/if}
                    </td>
                    <td class="px-2 py-1">
                        <img
                            src="{kill.victim.character_image_url}?size=64"
                            alt="Character: {kill.victim.character_name}"
                            class="w-10 rounded"
                        />
                    </td>
                    <td class="px-2 py-1">
                        {kill.victim.character_name}<br />
                        <span class="text-gray-400">{truncateString(kill.victim.corporation_name, 22)}</span>
                    </td>
                    <td class="px-2 py-1">
                        {#if Array.isArray(kill.attackers)}
                            {#each kill.attackers as attacker}
                                {#if attacker.final_blow}
                                    {#if kill.is_npc}
                                        {attacker.faction_name}<br />
                                        <span class="text-gray-400">{truncateString(attacker.ship_group_name, 22)}</span>
                                    {:else}
                                        {attacker.character_name}<br />
                                        <span class="text-gray-400">{truncateString(attacker.corporation_name, 22)}</span>
                                    {/if}
                                {/if}
                            {/each}
                        {/if}
                    </td>
                    <td class="px-2 py-1">
                        {kill.region_name} / {kill.system_name}<br />
                        <div class="flex justify-between items-center">
                            <div class="flex items-center">
                                <span class="text-gray-400">{kill.attackers.length}</span>
                                <img src={involvedImage} alt="{kill.attackers.length} Involved" />
                            </div>
                            <div class="text-right text-gray-500">{kill.kill_time}</div>
                        </div>
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>

<!-- Pagination Control at the Bottom -->
<div class="flex justify-between items-center mt-4">
    <button
        on:click={() => changePage(page - 1)}
        disabled={page === 1 || loading}
        class="px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-md hover:bg-gray-700 disabled:opacity-50"
    >
        Previous
    </button>
    <span class="text-white">Page {page}</span>
    <button
        on:click={() => changePage(page + 1)}
        disabled={loading}
        class="px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-md hover:bg-gray-700 disabled:opacity-50"
    >
        Next
    </button>
</div>
