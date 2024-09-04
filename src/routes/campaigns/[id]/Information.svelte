<script lang="ts">
    export let campaign;

    // Utility function to format large numbers with commas
    function formatNumber(num: number) {
        return num.toLocaleString();
    }
</script>

<!-- Campaign Overview -->
<div class="p-4 rounded-lg shadow-lg text-white">
    <h2 class="text-xl font-bold mb-4">Campaign Overview</h2>
    <p class="mb-2">{campaign.description}</p>

    <!-- Campaign Stats Table -->
    <div class="overflow-x-auto" role="table">
        <table class="table-auto min-w-full bg-semi-transparent rounded-lg shadow-lg">
            <thead>
                <tr class="bg-darker text-white uppercase text-xs leading-normal">
                    <th class="px-2 py-1">Stat</th>
                    <th class="px-2 py-1">Friendly</th>
                    <th class="px-2 py-1">Foe</th>
                    <th class="px-2 py-1">Total</th>
                </tr>
            </thead>
            <tbody class="text-gray-300 text-sm">
                <!-- Kills -->
                <tr class="border-b border-gray-700 hover:bg-gray-600 transition-colors duration-300">
                    <td class="px-2 py-1">Kills</td>
                    <td class="px-2 py-1">{formatNumber(campaign.stats.friendlyKills)}</td>
                    <td class="px-2 py-1">{formatNumber(campaign.stats.foeKills)}</td>
                    <td class="px-2 py-1">{formatNumber(campaign.stats.totalKills)}</td>
                </tr>
                <!-- Losses -->
                <tr class="border-b border-gray-700 hover:bg-gray-600 transition-colors duration-300">
                    <td class="px-2 py-1">Losses</td>
                    <td class="px-2 py-1">{formatNumber(campaign.stats.friendlyLosses)}</td>
                    <td class="px-2 py-1">{formatNumber(campaign.stats.foeLosses)}</td>
                    <td class="px-2 py-1">{formatNumber(campaign.stats.friendlyLosses + campaign.stats.foeLosses)}</td>
                </tr>
                <!-- ISK Value Lost -->
                <tr class="border-b border-gray-700 hover:bg-gray-600 transition-colors duration-300">
                    <td class="px-2 py-1">ISK Value Lost</td>
                    <td class="px-2 py-1">{formatNumber(campaign.stats.friendlyTotalValue)} ISK</td>
                    <td class="px-2 py-1">{formatNumber(campaign.stats.foeTotalValue)} ISK</td>
                    <td class="px-2 py-1">{formatNumber(campaign.stats.totalValue)} ISK</td>
                </tr>
                <!-- Active Pilots -->
                <tr class="border-b border-gray-700 hover:bg-gray-600 transition-colors duration-300">
                    <td class="px-2 py-1">Active Pilots</td>
                    <td class="px-2 py-1">{formatNumber(campaign.stats.friendlyActivePilots)}</td>
                    <td class="px-2 py-1">{formatNumber(campaign.stats.foeActivePilots)}</td>
                    <td class="px-2 py-1">{formatNumber(campaign.stats.friendlyActivePilots + campaign.stats.foeActivePilots)}</td>
                </tr>
                <!-- Active Corporations -->
                <tr class="border-b border-gray-700 hover:bg-gray-600 transition-colors duration-300">
                    <td class="px-2 py-1">Active Corporations</td>
                    <td class="px-2 py-1">{formatNumber(campaign.stats.friendlyActiveCorporations)}</td>
                    <td class="px-2 py-1">{formatNumber(campaign.stats.foeActiveCorporations)}</td>
                    <td class="px-2 py-1">{formatNumber(campaign.stats.friendlyActiveCorporations + campaign.stats.foeActiveCorporations)}</td>
                </tr>
                <!-- Active Alliances -->
                <tr class="border-b border-gray-700 hover:bg-gray-600 transition-colors duration-300">
                    <td class="px-2 py-1">Active Alliances</td>
                    <td class="px-2 py-1">{formatNumber(campaign.stats.friendlyActiveAlliances)}</td>
                    <td class="px-2 py-1">{formatNumber(campaign.stats.foeActiveAlliances)}</td>
                    <td class="px-2 py-1">{formatNumber(campaign.stats.friendlyActiveAlliances + campaign.stats.foeActiveAlliances)}</td>
                </tr>
                <!-- Active Systems -->
                <tr class="border-b border-gray-700 hover:bg-gray-600 transition-colors duration-300">
                    <td class="px-2 py-1">Active Systems</td>
                    <td class="px-2 py-1">{formatNumber(campaign.stats.friendlyActiveSystems)}</td>
                    <td class="px-2 py-1">{formatNumber(campaign.stats.foeActiveSystems)}</td>
                    <td class="px-2 py-1">{formatNumber(campaign.stats.activeSystems)}</td>
                </tr>
                <!-- Active Regions -->
                <tr class="border-b border-gray-700 hover:bg-gray-600 transition-colors duration-300">
                    <td class="px-2 py-1">Active Regions</td>
                    <td class="px-2 py-1">{formatNumber(campaign.stats.friendlyActiveRegions)}</td>
                    <td class="px-2 py-1">{formatNumber(campaign.stats.foeActiveRegions)}</td>
                    <td class="px-2 py-1">{formatNumber(campaign.stats.activeRegions)}</td>
                </tr>
                <!-- Used Ships -->
                <tr class="border-b border-gray-700 hover:bg-gray-600 transition-colors duration-300">
                    <td class="px-2 py-1">Used Ships</td>
                    <td class="px-2 py-1">{formatNumber(campaign.stats.friendlyUsedShips)}</td>
                    <td class="px-2 py-1">{formatNumber(campaign.stats.foeUsedShips)}</td>
                    <td class="px-2 py-1">{formatNumber(campaign.stats.usedShips)}</td>
                </tr>
                <!-- Used Ship Groups -->
                <tr class="border-b border-gray-700 hover:bg-gray-600 transition-colors duration-300">
                    <td class="px-2 py-1">Used Ship Groups</td>
                    <td class="px-2 py-1">{formatNumber(campaign.stats.friendlyUsedShipGroups)}</td>
                    <td class="px-2 py-1">{formatNumber(campaign.stats.foeUsedShipGroups)}</td>
                    <td class="px-2 py-1">{formatNumber(campaign.stats.usedShipGroups)}</td>
                </tr>
                <!-- Solo Kills -->
                <tr class="border-b border-gray-700 hover:bg-gray-600 transition-colors duration-300">
                    <td class="px-2 py-1">Solo Kills</td>
                    <td class="px-2 py-1">{formatNumber(campaign.stats.soloKills)}</td>
                    <td class="px-2 py-1">-</td>
                    <td class="px-2 py-1">{formatNumber(campaign.stats.soloKills)}</td>
                </tr>
                <!-- NPC Kills -->
                <tr class="border-b border-gray-700 hover:bg-gray-600 transition-colors duration-300">
                    <td class="px-2 py-1">NPC Kills</td>
                    <td class="px-2 py-1">{formatNumber(campaign.stats.npcKills)}</td>
                    <td class="px-2 py-1">-</td>
                    <td class="px-2 py-1">{formatNumber(campaign.stats.npcKills)}</td>
                </tr>
            </tbody>
        </table>
    </div>
</div>

<style>
    .bg-darker {
        background-color: #2D3748; /* Darker gray for table headers */
    }
    .bg-semi-transparent {
        background-color: rgba(255, 255, 255, 0.05);
    }
</style>
