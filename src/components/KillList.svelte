<script>
    export let url;

    import { onMount, afterUpdate } from 'svelte';
    import { fetchKillList } from '$lib/fetchKillList.js';

    let kills = [];
    let page = 1;
    let loading = false;
    let sentinel;
    let observer;

    async function loadMore() {
        if (loading) return;
        loading = true;
        const newKills = await fetchKillList(url, page);
        kills = [...kills, ...newKills];
        page++;
        loading = false;
    }

    onMount(async () => {
        loadMore();
        observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                loadMore();
            }
        }, { threshold: 1 });
    });

    afterUpdate(() => {
        if (sentinel) {
            observer.observe(sentinel);
        }
    });

    import involvedImage from '../images/involved.png';

    function formatNumber(value) {
        const formatter = new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

        return formatter.format(value);
    }
</script>

<div class="overflow-x-auto">
    <table class="table-auto w-full bg-semi-transparent bg-gray-800 rounded-lg shadow-lg">
        <thead>
        <tr class="bg-darker text-white uppercase text-xs leading-normal">
            <th class="px-2 py-1"></th>
            <th class="px-2 py-1" scope="col">Ship</th>
            <th class="px-2 py-1"></th>
            <th class="px-2 py-1" scope="col">Victim</th>
            <th class="px-2 py-1" scope="col">Final Blow</th>
            <th class="px-2 py-1" scope="col">Location</th>
        </tr>
        </thead>

        <tbody class="text-gray-300 text-sm">
        {#each kills as kill (kill.killmail_id)}
            <tr class="border-b border-gray-700 hover:bg-gray-600 transition-colors duration-300">
                <td class="px-2 py-1">
                    <img src="{kill.victim.ship_image_url}?size=32" alt="Ship" class="w-10 rounded">
                </td>
                <td class="px-2 py-1">
                    {kill.victim.ship_name}<br><span class="text-gray-400">{formatNumber(kill.total_value)} ISK</span>
                </td>
                <td class="px-2 py-1">
                    <img src="{kill.victim.character_image_url}?size=32" alt="Pilot" class="w-10 rounded">
                </td>
                <td class="px-2 py-1">
                    {kill.victim.character_name}<br><span class="text-gray-400">{kill.victim.corporation_name}</span>
                </td>
                <td class="px-2 py-1">
                    {#if Array.isArray(kill.attackers)}
                        {#each kill.attackers as attacker}
                            {#if attacker.final_blow === true}
                                {attacker.character_name}<br><span
                                class="text-gray-400">{attacker.corporation_name}</span>
                            {/if}
                        {/each}
                    {/if}
                </td>
                <td class="px-2 py-1">
                    {kill.region_name} / {kill.system_name}<br>
                    <div class="flex justify-between items-center">
                        <div class="flex items-center">
                            <span class="text-gray-400">{kill.attackers.length}</span>
                            <img src="{involvedImage}" />
                        </div>
                        <div class="text-right text-gray-500">{kill.kill_time_str}</div>
                    </div>
                </td>
            </tr>
        {/each}
        </tbody>
    </table>
</div>

<!-- Add a sentinel element at the bottom of your page -->
<div bind:this={sentinel}></div>
