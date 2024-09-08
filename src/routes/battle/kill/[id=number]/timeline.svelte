<script lang="ts">
    import { formatNumber } from '$lib/Helpers.ts';

    export let killmails = []; // Array of killmails
    export let battle; // The battle info to determine team affiliation

    // Helper to determine if a kill belongs to the blue team
    function isBlueTeamKill(kill) {
        return battle.blue_team.alliances.some(alliance => alliance.id === kill.victim.alliance_id) ||
            battle.blue_team.corporations.some(corp => corp.id === kill.victim.corporation_id);
    }

    // Sort killmails by time (assuming kill_time is in "YYYY-MM-DD HH:mm:ss" format)
    killmails.sort((a, b) => new Date(a.kill_time) - new Date(b.kill_time));

    function truncateString(str, num) {
        return str.length <= num ? str : str.slice(0, num) + '...';
    }
</script>

<!-- Combined Kill List -->
<div class="mt-4">
    <div class="overflow-x-auto col-span-2" role="table">
        <table class="table-auto min-w-full bg-semi-transparent bg-gray-800 rounded-lg shadow-lg">
            <thead>
                <tr class="bg-darker text-white uppercase text-xs leading-normal">
                    <th class="px-2 py-1 text-right" scope="col">Blue Team Losses</th>
                    <th class="px-2 py-1 text-center" scope="col">VS</th> <!-- Visible Divider -->
                    <th class="px-2 py-1 text-left" scope="col">Red Team Losses</th>
                </tr>
            </thead>
            <tbody class="text-gray-300 text-sm">
                {#each killmails as kill}
                    <tr
                        class="border-b border-gray-700 hover:bg-gray-600 transition-colors duration-300 cursor-pointer"
                        on:click={() => window.location.href = `/kill/${kill.killmail_id}`}
                        role="button"
                        aria-label="View killmail details for {kill.victim.character_name} in {kill.victim.ship_name}"
                        tabindex="0"
                    >
                        <!-- Blue Team Kill -->
                        {#if isBlueTeamKill(kill)}
                            <td class="text-right">
                                <div class="flex justify-between items-center">
                                    <!-- Ship Name & Corporation (Aligned to the far left) -->
                                    <div class="text-center">
                                        <div class="font-bold">{truncateString(kill.victim.ship_name, 20)}</div>
                                        <div class="text-xs">{kill.victim.corporation_name}</div>
                                    </div>

                                    <!-- Character Name & Damage in the middle -->
                                    <div class="text-center mx-4">
                                        <div class="font-bold">{kill.victim.character_name}</div>
                                        <div class="text-xs">{formatNumber(kill.victim.damage_taken)} damage</div>
                                    </div>

                                    <!-- Kill Time & Image -->
                                    <div class="flex flex-col items-start">
                                        <div class="flex flex-row items-center">
                                            <div class="text-xs mr-4">{kill.kill_time}</div>
                                            <img src={`https://images.evetech.net/types/${kill.victim.ship_id}/icon`} alt={kill.victim.ship_type} class="h-12 w-12" />
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td class="text-center h-full w-px bg-gray-600"></td>
                            <td></td>
                        {/if}

                        <!-- Red Team Kill -->
                        {#if !isBlueTeamKill(kill)}
                            <td></td>
                            <td class="text-center h-full w-px bg-gray-600"></td>
                            <td class="text-left">
                                <div class="flex justify-between items-center">
                                    <!-- Kill Time & Image -->
                                    <div class="flex flex-col items-start mr-4">
                                        <div class="flex flex-row items-center">
                                            <img src={`https://images.evetech.net/types/${kill.victim.ship_id}/icon`} alt={kill.victim.ship_type} class="h-12 w-12" />
                                            <div class="text-xs ml-4">{kill.kill_time}</div>
                                        </div>
                                    </div>

                                    <!-- Character Name & Damage in the middle -->
                                    <div class="text-center mx-4">
                                        <div class="font-bold">{kill.victim.character_name}</div>
                                        <div class="text-xs">{formatNumber(kill.victim.damage_taken)} damage</div>
                                    </div>

                                    <!-- Ship Name & Corporation (Aligned to the far right) -->
                                    <div class="text-center mx-4">
                                        <div class="font-bold">{truncateString(kill.victim.ship_name, 20)}</div>
                                        <div class="text-xs">{kill.victim.corporation_name}</div>
                                    </div>
                                </div>
                            </td>
                        {/if}
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
</div>
