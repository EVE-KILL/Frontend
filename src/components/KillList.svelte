<script lang="ts">
    import type { Killmail } from '../types/Killmail';
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { stompConnection } from '$lib/Stomp.ts';
    import { fetchKillList } from '$lib/fetchKillList.ts';
    import { formatNumber } from '$lib/Helpers.ts';
    import involvedImage from '../images/involved.png';
    import commentImage from '../images/comment.gif';

    export let url: string;
    export let title: string = '';
    export let subscriptionTopic: string = 'all';
    export let filter: { field: string; value: any } | null = null;

    let kills: Killmail[] = [];
    let page: number = 1;
    let loading: boolean = false;
    let isPaused: boolean = false; // To pause adding new kills when hovering
    let pauseTimeout: any; // Timeout reference for pausing
    let queuedKills: Killmail[] = []; // Queue for incoming killmails while paused

    // Check for page number in the URL when the component is mounted
    onMount(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const pageParam = urlParams.get('killlistPage');
        if (pageParam) {
            page = parseInt(pageParam, 10);
        }
        loadKills();
        let topic = '/exchange/killmail_topic_exchange/' + subscriptionTopic;
        stompConnection(topic, handleIncomingMessage); // Use the dynamic or default topic
    });

    async function loadKills() {
        if (loading) return;
        loading = true;
        const newKills: Killmail[] = await fetchKillList(url, page);
        kills = newKills.slice(0, 100);  // Ensure we only keep the number of kills within the limit
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
        goto(newUrl.toString(), { replaceState: true });
    }

    function truncateString(str: any, num: number) {
        let stringifiedStr = String(str);
        return stringifiedStr.length <= num ? stringifiedStr : stringifiedStr.slice(0, num) + '...';
    }

    function handleIncomingMessage(message: Killmail) {
        if (page !== 1) return;

        if (filter && !matchesFilter(message, filter)) {
            return;
        }

        if (isPaused) {
            // Queue the message if paused
            queuedKills.push(message);
        } else {
            // Add the new kill to the top of the list
            addKillToList(message);
        }
    }

    function matchesFilter(killmail: Killmail, filter: { field: string; value: any }): boolean {
        const keys = filter.field.split('.'); // Split the field into its path components
        let current: any = killmail;

        // Traverse the object according to the keys path
        for (const key of keys) {
            if (Array.isArray(current)) {
                // If the current field is an array, check if any element matches
                return current.some((item) => item[key] === filter.value);
            } else {
                current = current[key];
            }

            // If at any point the path is undefined, return false
            if (current === undefined) {
                return false;
            }
        }

        // Final check to ensure we're comparing the correct value
        return current === filter.value;
    }

    function addKillToList(message: Killmail) {
        // Check if the killmail already exists in the list
        if (!kills.find(kill => kill.killmail_id === message.killmail_id)) {
            kills = [message, ...kills];
        }

        // Keep the list within the max limit by removing the last kill if necessary
        if (kills.length > 100) {
            kills.pop();
        }
    }

    function pauseAddingKills() {
        clearTimeout(pauseTimeout);
        isPaused = true;
        pauseTimeout = setTimeout(() => {
            isPaused = false;
            // Process the queued killmails
            while (queuedKills.length > 0) {
                addKillToList(queuedKills.shift()!);
            }
        }, 2500);
    }

    function handleClick(event: MouseEvent, killmailId: string) {
        if (event.ctrlKey || event.metaKey || event.button === 1) {
            event.preventDefault();
            window.open(`/kill/${killmailId}`, '_blank');
        } else {
            window.location.href = `/kill/${killmailId}`;
        }
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
                    class="border-b border-gray-700 hover:bg-gray-600 transition-colors duration-300 cursor-pointer"
                    on:mousedown={(event) => handleClick(event, kill.killmail_id)}
                    on:mouseover={pauseAddingKills}
                    on:focus={pauseAddingKills}
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
                                &nbsp;
                                <img src={involvedImage} alt="{kill.attackers.length} Involved" />
                                &nbsp;
                                <span class="text-gray-400">{kill.comment_count || 0}</span>
                                &nbsp;
                                <img src={commentImage} alt="{kill.attackers.length} Involved" />
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
