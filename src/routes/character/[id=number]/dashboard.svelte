<script lang="ts">
    import type { Character } from '../../../types/Character.js';
    import { onMount } from 'svelte';
    import { convertEveHtml, formatNumber } from '$lib/Helpers.js';
	import { getUpstreamUrl } from '$lib/Config.js';

    export let data;
    let character: Character = data.character;
    let stats: any = null; // Initially null until fetched
    let sanitizedDescription: string;
    let statsLoading = true; // Loading indicator for stats
    const upstreamUrl = getUpstreamUrl(); // Replace with your actual upstream URL

    // Fetch stats on mount
    onMount(async () => {
        let description = convertEveHtml(character.description);
        if (description.startsWith("u'") || description.startsWith('u"')) {
            description = description.slice(2, -1);
        }
        sanitizedDescription = decodeUnicode(description);

        // Fetch the stats after the bio is shown
        try {
            const response = await fetch(`${upstreamUrl}/api/characters/${character.character_id}/stats`);
            stats = await response.json();
        } catch (error) {
            console.error("Failed to fetch stats:", error);
        } finally {
            statsLoading = false;
        }
    });

    function decodeUnicode(str: string): string {
        return str.replace(/\\u([\dA-F]{4})/gi, (match, grp) => {
            return String.fromCharCode(parseInt(grp, 16));
        });
    }

    function formatDate(dateStr: string): string {
        const date = new Date(dateStr);
        return date.toLocaleString();
    }

    // Helper function to sort by count in descending order
    function sortByCountDesc(items) {
        return Object.values(items).sort((a, b) => b.count - a.count);
    }
</script>

<!-- Dashboard Layout -->
<div class="dashboard grid grid-cols-2 gap-4 p-4">
    <!-- Character Bio Section -->
    <div class="bio-section p-4 bg-semi-transparent rounded-lg shadow-lg">
        <h2 class="text-xl font-bold mb-4">Character Bio</h2>
        <div class="monospace">
            {@html sanitizedDescription}
        </div>
    </div>

    <!-- Stats Section -->
    <div class="stats-section p-4 bg-semi-transparent rounded-lg shadow-lg">
        <h2 class="text-xl font-bold mb-4">Character Stats</h2>
        {#if statsLoading}
            <p>Loading stats...</p>
        {:else if stats}
            <table class="table-auto min-w-full mb-4">
                <thead>
                    <tr class="bg-darker text-white uppercase text-xs leading-normal">
                        <th class="px-2 py-1">Stat</th>
                        <th class="px-2 py-1">Value</th>
                    </tr>
                </thead>
                <tbody class="text-gray-300 text-sm">
                    <tr class="border-b border-gray-700 hover:bg-gray-600">
                        <td class="px-2 py-1">Kills</td>
                        <td class="px-2 py-1">{formatNumber(stats.kills, 0)}</td>
                    </tr>
                    <tr class="border-b border-gray-700 hover:bg-gray-600">
                        <td class="px-2 py-1">Losses</td>
                        <td class="px-2 py-1">{formatNumber(stats.losses, 0)}</td>
                    </tr>
                    <tr class="border-b border-gray-700 hover:bg-gray-600">
                        <td class="px-2 py-1">ISK Killed</td>
                        <td class="px-2 py-1">{formatNumber(stats.iskKilled, 0)} ISK</td>
                    </tr>
                    <tr class="border-b border-gray-700 hover:bg-gray-600">
                        <td class="px-2 py-1">ISK Lost</td>
                        <td class="px-2 py-1">{formatNumber(stats.iskLost, 0)} ISK</td>
                    </tr>
                    <tr class="border-b border-gray-700 hover:bg-gray-600">
                        <td class="px-2 py-1">Solo Kills</td>
                        <td class="px-2 py-1">{formatNumber(stats.soloKills, 0)}</td>
                    </tr>
                    <tr class="border-b border-gray-700 hover:bg-gray-600">
                        <td class="px-2 py-1">Solo Losses</td>
                        <td class="px-2 py-1">{formatNumber(stats.soloLosses, 0)}</td>
                    </tr>
                    <tr class="border-b border-gray-700 hover:bg-gray-600">
                        <td class="px-2 py-1">NPC Losses</td>
                        <td class="px-2 py-1">{formatNumber(stats.npcLosses, 0)}</td>
                    </tr>
                    <tr class="border-b border-gray-700 hover:bg-gray-600">
                        <td class="px-2 py-1">Blob Factor</td>
                        <td class="px-2 py-1">{stats.blobFactor.toFixed(2, 0)}</td>
                    </tr>
                    <tr class="border-b border-gray-700 hover:bg-gray-600">
                        <td class="px-2 py-1">Last Active</td>
                        <td class="px-2 py-1">{formatDate(stats.lastActive, 0)}</td>
                    </tr>
                </tbody>
            </table>

            <!-- Heat Map Section -->
            <h2 class="text-xl font-bold mb-4">Heat Map Activity (by Hour)</h2>
            <table class="table-auto min-w-full mb-4">
                <thead>
                    <tr class="bg-darker text-white uppercase text-xs leading-normal">
                        <th class="px-2 py-1">Hour</th>
                        <th class="px-2 py-1">Activity Count</th>
                    </tr>
                </thead>
                <tbody class="text-gray-300 text-sm">
                    {#each Object.entries(stats.heatMap) as [hour, count]}
                        <tr class="border-b border-gray-700 hover:bg-gray-600">
                            <td class="px-2 py-1">{hour.replace('h', '')}:00</td>
                            <td class="px-2 py-1">{formatNumber(count, 0)}</td>
                        </tr>
                    {/each}
                </tbody>
            </table>

            <!-- Most Used Ships Section (Sorted by Count) -->
            <h2 class="text-xl font-bold mb-4">Most Used Ships</h2>
            <table class="table-auto min-w-full mb-4">
                <thead>
                    <tr class="bg-darker text-white uppercase text-xs leading-normal">
                        <th class="px-2 py-1">Ship</th>
                        <th class="px-2 py-1">Usage Count</th>
                    </tr>
                </thead>
                <tbody class="text-gray-300 text-sm">
                    {#each sortByCountDesc(stats.mostUsedShips) as ship}
                        <tr class="border-b border-gray-700 hover:bg-gray-600">
                            <td class="px-2 py-1">{ship.name}</td>
                            <td class="px-2 py-1">{formatNumber(ship.count, 0)}</td>
                        </tr>
                    {/each}
                </tbody>
            </table>

            <!-- Most Lost Ships Section (Sorted by Count) -->
            <h2 class="text-xl font-bold mb-4">Most Lost Ships</h2>
            <table class="table-auto min-w-full mb-4">
                <thead>
                    <tr class="bg-darker text-white uppercase text-xs leading-normal">
                        <th class="px-2 py-1">Ship</th>
                        <th class="px-2 py-1">Loss Count</th>
                    </tr>
                </thead>
                <tbody class="text-gray-300 text-sm">
                    {#each sortByCountDesc(stats.mostLostShips) as ship}
                        <tr class="border-b border-gray-700 hover:bg-gray-600">
                            <td class="px-2 py-1">{ship.name}</td>
                            <td class="px-2 py-1">{formatNumber(ship.count, 0)}</td>
                        </tr>
                    {/each}
                </tbody>
            </table>

            <!-- Dies To Corporations Section (Sorted by Count) -->
            <h2 class="text-xl font-bold mb-4">Dies To Corporations</h2>
            <table class="table-auto min-w-full mb-4">
                <thead>
                    <tr class="bg-darker text-white uppercase text-xs leading-normal">
                        <th class="px-2 py-1">Corporation</th>
                        <th class="px-2 py-1">Death Count</th>
                    </tr>
                </thead>
                <tbody class="text-gray-300 text-sm">
                    {#each sortByCountDesc(stats.diesToCorporations) as corp}
                        <tr class="border-b border-gray-700 hover:bg-gray-600">
                            <td class="px-2 py-1">{corp.name}</td>
                            <td class="px-2 py-1">{formatNumber(corp.count, 0)}</td>
                        </tr>
                    {/each}
                </tbody>
            </table>

            <!-- Dies To Alliances Section (Sorted by Count) -->
            <h2 class="text-xl font-bold mb-4">Dies To Alliances</h2>
            <table class="table-auto min-w-full mb-4">
                <thead>
                    <tr class="bg-darker text-white uppercase text-xs leading-normal">
                        <th class="px-2 py-1">Alliance</th>
                        <th class="px-2 py-1">Death Count</th>
                    </tr>
                </thead>
                <tbody class="text-gray-300 text-sm">
                    {#each sortByCountDesc(stats.diesToAlliances) as alliance}
                        <tr class="border-b border-gray-700 hover:bg-gray-600">
                            <td class="px-2 py-1">{alliance.name}</td>
                            <td class="px-2 py-1">{formatNumber(alliance.count, 0)}</td>
                        </tr>
                    {/each}
                </tbody>
            </table>

            <!-- Flies With Corporations Section (Sorted by Count) -->
            <h2 class="text-xl font-bold mb-4">Flies With Corporations</h2>
            <table class="table-auto min-w-full mb-4">
                <thead>
                    <tr class="bg-darker text-white uppercase text-xs leading-normal">
                        <th class="px-2 py-1">Corporation</th>
                        <th class="px-2 py-1">Flight Count</th>
                    </tr>
                </thead>
                <tbody class="text-gray-300 text-sm">
                    {#each sortByCountDesc(stats.fliesWithCorporations) as corp}
                        <tr class="border-b border-gray-700 hover:bg-gray-600">
                            <td class="px-2 py-1">{corp.name}</td>
                            <td class="px-2 py-1">{formatNumber(corp.count, 0)}</td>
                        </tr>
                    {/each}
                </tbody>
            </table>

            <!-- Flies With Alliances Section (Sorted by Count) -->
            <h2 class="text-xl font-bold mb-4">Flies With Alliances</h2>
            <table class="table-auto min-w-full">
                <thead>
                    <tr class="bg-darker text-white uppercase text-xs leading-normal">
                        <th class="px-2 py-1">Alliance</th>
                        <th class="px-2 py-1">Flight Count</th>
                    </tr>
                </thead>
                <tbody class="text-gray-300 text-sm">
                    {#each sortByCountDesc(stats.fliesWithAlliances) as alliance}
                        <tr class="border-b border-gray-700 hover:bg-gray-600">
                            <td class="px-2 py-1">{alliance.name}</td>
                            <td class="px-2 py-1">{formatNumber(alliance.count, 0)}</td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        {/if}
    </div>
</div>

<!-- Styles -->
<style>
    .dashboard {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
    }
    .bio-section, .stats-section {
        background-color: rgba(255, 255, 255, 0.05);
        border-radius: 0.5rem;
    }
    .monospace {
        font-family: 'Shentox', monospace;
    }
    .bg-darker {
        background-color: #2D3748;
    }
</style>
