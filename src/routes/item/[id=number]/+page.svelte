<script lang="ts">
    import { onMount } from 'svelte';
    import { getUpstreamUrl } from '$lib/Config';
    import { formatNumber } from '$lib/Helpers.js';
    import type { Killmail } from '../../../types/Killmail.js';

    export let data;
    const upstreamUrl = getUpstreamUrl();
    let itemUrl: string = `${upstreamUrl}/api/items/${data.id}`;
    let itemPriceUrl = `${upstreamUrl}/api/items/${data.id}/pricing/10000002/30`;
    let itemKillmailsUrl = `${upstreamUrl}/api/items/${data.id}/killmails/20`;
    let killmailsUrl = `${upstreamUrl}/api/killmail/`;

    let item = [];
    let killmails: Killmail[] = [];
    let prices = [];

    onMount(async () => {
        const response = await fetch(itemUrl);
        item = await response.json();
        console.log(item);

        const responseKillmails = await fetch(itemKillmailsUrl);
        let killmailsIds = await responseKillmails.json();

        // Use the POST api to send the list of killmail_ids from killmailsIds to the killmails endpoint, to retrieve the full killmails
        const postKillmails = await fetch(killmailsUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(killmailsIds.map(killmail => killmail.killmail_id))
        });
        killmails = await postKillmails.json();
        console.log(killmails);

        const responsePrice = await fetch(itemPriceUrl);
        prices = await responsePrice.json();
        console.log(prices);
    });
</script>

<div class="container mx-auto px-4 text-white">
    <div class="p-4 mb-4 rounded">
        <h2 class="text-xl font-bold flex items-center">
            <a href="/item/{item.type_id}" rel="tooltip" title="{item.name}" class="mr-2">
                <img class="rounded" src={`https://images.evetech.net/types/${item.type_id}/icon?size=64`} style="height: 64px; width: 64px;" alt="{item.name}">
            </a>
            {item.name}
        </h2>
        <div class="border-b border-gray-600 mb-4">
            <ul class="flex space-x-4">
                <li class="text-blue-300">Description</li>
            </ul>
        </div>
        <div>{item.description}</div>
    </div>

    <div class="flex space-x-4">
        <div class="w-1/2 p-4 rounded">
            <h2 class="text-xl font-bold mb-4">Latest Kills</h2>
            <div>
                {#each killmails as killmail}
                <a href="/kill/{killmail.killmail_id}" rel="tooltip" title="Detail for {killmail.killmail_id}" class="flex items-center mb-4 cursor-pointer no-underline text-white">
                    <img src="{killmail.victim.ship_image_url}" style="height: 64px; width: 64px;" class="rounded mr-2" alt="{killmail.victim.ship_name}">
                    <a href="/character/{killmail.victim.character_id}" rel="tooltip" title="{killmail.victim.character_name}" class="mr-2">
                        <img src="{killmail.victim.character_image_url}" style="height: 64px; width: 64px;" class="rounded" alt="{killmail.victim.character_name}">
                    </a>
                    <a href="/corporation/{killmail.victim.corporation_id}" rel="tooltip" title="{killmail.victim.corporation_name}" class="mr-2">
                        <img src="{killmail.victim.corporation_image_url}" style="height: 64px; width: 64px;" class="rounded" alt="{killmail.victim.corporation_name}">
                    </a>
                    <a href="/alliance/{killmail.victim.alliance_id}" rel="tooltip" title="{killmail.victim.alliance_name}" class="mr-2">
                        <img src="{killmail.victim.alliance_image_url}" style="height: 64px; width: 64px;" class="rounded" alt="{killmail.victim.alliance_name}">
                    </a>
                    <div>
                        {killmail.victim.character_name} ({killmail.victim.ship_name})<br>
                        {killmail.victim.corporation_name}<br>
                        {killmail.victim.alliance_name}
                    </div>
                </a>
                {/each}
            </div>
        </div>
        <div class="w-1/2 p-4 rounded">
            <h2 class="text-xl font-bold mb-4">Market Prices - The Forge</h2>
            <div>
                <table class="table-auto w-full text-left text-sm">
                    <thead>
                        <tr>
                            <th class="border-b border-gray-600 py-2">Date</th>
                            <th class="border-b border-gray-600 py-2 text-right">Min Price</th>
                            <th class="border-b border-gray-600 py-2 text-right">Avg Price</th>
                            <th class="border-b border-gray-600 py-2 text-right">Max Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each prices as price}
                        <tr>
                            <td class="border-b border-gray-600 py-2">{price.date}</td>
                            <td class="border-b border-gray-600 py-2 text-right">{formatNumber(price.lowest)} ISK</td>
                            <td class="border-b border-gray-600 py-2 text-right">{formatNumber(price.average)} ISK</td>
                            <td class="border-b border-gray-600 py-2 text-right">{formatNumber(price.highest)} ISK</td>
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
