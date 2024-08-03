<script lang="ts">
    import { onMount } from 'svelte';
    import { getUpstreamUrl } from '$lib/Config';

    export let item;
    let itemId = item.type_id;
    let fittings = [];
    const upstreamUrl = getUpstreamUrl();
    let fittingsUrl = `${upstreamUrl}/api/fitting/top10/${itemId}`;

    onMount(async () => {
        const response = await fetch(fittingsUrl);
        fittings = await response.json();
    });

    function generateEveShipFitUrl(killmailId, hash) {
        return `https://eveship.fit/?fit=killmail:${killmailId}/${hash}`;
    }
</script>

{#if !fittings.error}
    <div class="w-full p-4 rounded bg-opacity-75">
        <h2 class="text-xl font-bold mb-4">Top 10 Fittings</h2>
        <div class="grid grid-cols-2 gap-4">
            {#each fittings as fitting, index}
                {#if fitting.killmails.length > 0}
                    <div class="border border-gray-700 hover:bg-gray-600 transition-colors duration-300 p-2">
                        <a href={generateEveShipFitUrl(fitting.killmails[0].killmail_id, fitting.killmails[0].hash)} target="_blank" rel="noopener noreferrer">
                            <div>{@html fitting.svg}</div>
                        </a>
                    </div>
                {/if}
            {/each}
        </div>
    </div>
{/if}
