<script lang="ts">
    import { onMount } from 'svelte';
    import { getUpstreamUrl } from '$lib/Config';
    import { convertEveHtml } from '$lib/Helpers.js';
    import KillList from '../../../components/Item/KillList.svelte';
    import PriceList from '../../../components/Item/PriceList.svelte';
    import Fittings from '../../../components/Item/Fittings.svelte';

    export let data;
    const upstreamUrl = getUpstreamUrl();
    let itemUrl: string = `${upstreamUrl}/api/items/${data.id}`;
    let item;

    onMount(async () => {
        const response = await fetch(itemUrl);
        item = await response.json();
    });
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
            <div class="w-1/2 flex flex-col space-y-4">
                <KillList {item} />
            </div>
            <div class="w-1/2">
                <Fittings {item}/>
                <PriceList {item} />
            </div>
        </div>
    </div>
{/if}
