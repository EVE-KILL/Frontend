<script lang="ts">
    import { onMount } from 'svelte';
    import { getUpstreamUrl } from '$lib/Config';
    import { formatNumber, truncateString, convertEveHtml } from '$lib/Helpers.js';
    import type { Killmail } from '../../../types/Killmail.js';

    export let data;
    const upstreamUrl = getUpstreamUrl();
    let itemUrl: string = `${upstreamUrl}/api/items/${data.id}`;
    let itemPriceUrl = `${upstreamUrl}/api/items/${data.id}/pricing/10000002/30`;
    let itemKillmailsUrl = `${upstreamUrl}/api/items/${data.id}/killmails/20`;
    let killmailsUrl = `${upstreamUrl}/api/killmail/`;

    let item;
    let killmails: Killmail[] = [];
    let prices = [];

    onMount(async () => {
        const response = await fetch(itemUrl);
        const responsePrice = await fetch(itemPriceUrl);
        item = await response.json();
        prices = await responsePrice.json();

        const responseKillmails = await fetch(itemKillmailsUrl);
        let killmailsIds = await responseKillmails.json();
        const postKillmails = await fetch(killmailsUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(killmailsIds.map(killmail => killmail.killmail_id))
        });
        killmails = await postKillmails.json();
    });
</script>

{#if item}
    <div class="container mx-auto px-4 text-white">
        <div class="p-4 mb-4 rounded">
            <h2 class="text-xl font-bold flex items-center">
                <a href="/item/{item.type_id}" rel="tooltip" title="{item.name}" class="mr-2">
                    <img class="rounded" src={`https://images.evetech.net/types/${item.type_id}/${item.name.includes('Blueprint') ? 'bp' : 'icon'}?size=64`} style="height: 64px; width: 64px;" alt="{item.name}">
                </a>
                {item.name}
            </h2>
            <div class="border-b border-gray-600 mb-4">
                <ul class="flex space-x-4">
                    <li class="text-blue-300">Description</li>
                </ul>
            </div>
            <div>{@html convertEveHtml(item.description)}</div>
        </div>

        <div class="flex space-x-4">
            <div class="w-1/2 p-4 rounded bg-gray-800 bg-opacity-75">
                <h2 class="text-xl font-bold mb-4">Latest Kills</h2>
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
                            {#each killmails as kill (kill.killmail_id)}
                                <tr
                                    class="border-b border-gray-700 hover:bg-gray-600 transition-colors duration-300 cursor-pointer"
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
                                                <img src="https://images.evetech.net/involved.png" alt="{kill.attackers.length} Involved" />
                                            </div>
                                            <div class="text-right text-gray-500">{kill.kill_time}</div>
                                        </div>
                                    </td>
                                </tr>
                            {/each}
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="w-1/2 p-4 rounded bg-gray-800 bg-opacity-75">
                <h2 class="text-xl font-bold mb-4">Market Prices - The Forge</h2>
                <div>
                    <table class="table-auto w-full text-left text-sm bg-semi-transparent bg-gray-800 rounded-lg shadow-lg">
                        <thead>
                            <tr class="bg-darker text-white uppercase text-xs leading-normal">
                                <th class="px-2 py-1">Date</th>
                                <th class="px-2 py-1 text-right">Min Price</th>
                                <th class="px-2 py-1 text-right">Avg Price</th>
                                <th class="px-2 py-1 text-right">Max Price</th>
                            </tr>
                        </thead>
                        <tbody class="text-gray-300 text-sm">
                            {#each prices as price}
                            <tr class="border-b border-gray-700 hover:bg-gray-600 transition-colors duration-300">
                                <td class="px-2 py-1">{price.date}</td>
                                <td class="px-2 py-1 text-right">{formatNumber(price.lowest)} ISK</td>
                                <td class="px-2 py-1 text-right">{formatNumber(price.average)} ISK</td>
                                <td class="px-2 py-1 text-right">{formatNumber(price.highest)} ISK</td>
                            </tr>
                            {/each}
                        </tbody>
                    </table>
                    <i class="text-gray-500 text-xs mt-2 text-left">
                        Information pulled from EVERef <a href="https://data.everef.net/market-history/" target="_blank" rel="noopener noreferrer" class="text-blue-400">https://data.everef.net/market-history/</a>.
                    </i>
                </div>
            </div>
        </div>
    </div>
{/if}
