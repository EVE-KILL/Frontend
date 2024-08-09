<script lang="ts">
    import type { Killmail } from '../types/Killmail';
    import { onMount, onDestroy, afterUpdate } from 'svelte';
    import { fetchKillList } from '$lib/fetchKillList.ts';
    import { formatNumber } from '$lib/Helpers.ts';

    export let url: string;
	export let title: string = '';
    export let wsFilter = ['all'];

    let kills: Killmail[] = [];
    let page: number = 1;
    let loading: boolean = false;
    let sentinel: HTMLDivElement;
    let observer: IntersectionObserver;
    let killmailIds = new Set<string>();
    let socket: WebSocket;

    async function loadMore() {
        if (loading) return;
        loading = true;
        const newKills: Killmail[] = await fetchKillList(url, page);
        const uniqueKills = newKills.filter(kill => !killmailIds.has(kill.killmail_id));
        uniqueKills.forEach(kill => killmailIds.add(kill.killmail_id));
        kills = [...kills, ...uniqueKills];
        page++;
        loading = false;
    }

    function resetAndLoad() {
        kills = [];
        page = 1;
        killmailIds.clear();
        loadMore();
    }

    $: url, resetAndLoad();

    onMount(async () => {
        observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting) {
                    loadMore();
                }
            },
            { threshold: 1 }
        );

        socket = new WebSocket('wss://ws.eve-kill.com/kills');

        socket.addEventListener('open', () => {
            socket.send(JSON.stringify({ type: 'subscribe', data: wsFilter }));
        });

        socket.addEventListener('message', event => {
            const newKill = JSON.parse(event.data);

            if (!killmailIds.has(newKill.killmail_id)) {
                let newKillKillTime = new Date(newKill.kill_time);
                let killsKillTime = new Date(kills[0]?.kill_time ?? 0);

                if (newKillKillTime.getTime() > killsKillTime.getTime()) {
                    kills = [{ ...newKill }, ...kills];
                    killmailIds.add(newKill.killmail_id);
                }
            }
        });
    });

    onDestroy(async () => {
        // Close the websocket connection
        socket && socket.close();
    });

    afterUpdate(() => {
        if (sentinel) {
            observer.observe(sentinel);
        }
    });

    import involvedImage from '../images/involved.png';

    function truncateString(str: any, num: number) {
        let stringifiedStr = String(str);
        return stringifiedStr.length <= num ? stringifiedStr : stringifiedStr.slice(0, num) + '...';
    }
</script>

{#if title !== undefined}
	<h1 class="text-white">{title}</h1>
{/if}

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

<div bind:this={sentinel}></div>
