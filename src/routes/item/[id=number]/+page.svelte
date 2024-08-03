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
        let killmailsIds: number[] = await responseKillmails.json();
        const postKillmails = await fetch(killmailsUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(killmailsIds)
        });
        killmails = await postKillmails.json();
    });

    function handleKillmailClick(killmailId: number) {
        window.location.href = `/kill/${killmailId}`;
    }
</script>

{#if item}
    <div class="container mx-auto px-4 text-white">
        <div class="p-4 mb-4 rounded">
            <h2 class="text-xl font-bold flex items-center">
                <a href={`/item/${item.type_id}`} class="mr-2">
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
            <div class="w-1/2 p-4 rounded bg-opacity-75">
                <h2 class="text-xl font-bold mb-4">Latest Kills</h2>
                <div class="overflow-x-auto" role="table">
                    <table class="table-auto min-w-full bg-semi-transparent rounded-lg shadow-lg">
                        <tbody class="text-gray-300 text-sm">
                        {#each killmails as kill (kill.killmail_id)}
                            <tr class="hover:bg-gray-600 transition-colors duration-300 cursor-pointer" on:click={() => handleKillmailClick(kill.killmail_id)}>
                                <td class="w-1/3 flex items-center space-x-2">
                                    <a href={`/kill/${kill.killmail_id}`}>
                                        <img src={`https://images.evetech.net/types/${kill.victim.ship_id}/render?size=64`} class="rounded w-16 h-16" alt="{kill.victim.ship_name}">
                                    </a>
                                    <a href={`/character/${kill.victim.character_id}`}>
                                        <img src={`https://images.evetech.net/characters/${kill.victim.character_id}/portrait?size=64`} class="rounded w-16 h-16" alt="{kill.victim.character_name}">
                                    </a>
                                    <a href={`/corporation/${kill.victim.corporation_id}`}>
                                        <img src={`https://images.evetech.net/corporations/${kill.victim.corporation_id}/logo?size=64`} class="rounded w-16 h-16" alt="{kill.victim.corporation_name}">
                                    </a>
                                    {#if kill.victim.alliance_id}
                                        <a href={`/alliance/${kill.victim.alliance_id}`}>
                                            <img src={`https://images.evetech.net/alliances/${kill.victim.alliance_id}/logo?size=64`} class="rounded w-16 h-16" alt="{kill.victim.alliance_name}">
                                        </a>
                                    {/if}
                                </td>
                                <td class="w-2/3">
                                    <div class="text-sm">
                                        <a href={`/kill/${kill.killmail_id}`} class="text-blue-400">{kill.victim.character_name} ({kill.victim.ship_name})</a><br>
                                        <a href={`/corporation/${kill.victim.corporation_id}`} class="text-blue-400">{kill.victim.corporation_name}</a><br>
                                        {#if kill.victim.alliance_name}
                                            <a href={`/alliance/${kill.victim.alliance_id}`} class="text-blue-400">{kill.victim.alliance_name}</a><br>
                                        {/if}
                                    </div>
                                </td>
                            </tr>
                        {/each}
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="w-1/2 p-4 rounded bg-opacity-75">
                <h2 class="text-xl font-bold mb-4">Market Prices - The Forge</h2>
                <div>
                    <table class="table-auto w-full text-left text-sm bg-semi-transparent rounded-lg shadow-lg">
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
