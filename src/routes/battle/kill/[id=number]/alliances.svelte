<script lang="ts">
    export let blueTeamAlliances;
    export let redTeamAlliances;

    import { convertIskToBillions } from "$lib/Helpers";
</script>

<div class="mt-4 grid grid-cols-2 gap-4">
    <!-- Blue Team Alliances -->
    <div>
        <div class="mb-2 text-lg font-bold">Blue Team Alliances</div>
        <div class="overflow-x-auto" role="table">
            <table class="table-auto min-w-full bg-semi-transparent bg-gray-800 rounded-lg shadow-lg">
                <thead>
                    <tr class="bg-darker text-white uppercase text-xs leading-normal">
                        <th class="px-2 py-1" scope="col">Alliance</th>
                        <th class="px-2 py-1" scope="col">Kills</th>
                        <th class="px-2 py-1" scope="col">Total Value</th>
                    </tr>
                </thead>
                <tbody class="text-gray-300 text-sm">
                    {#each blueTeamAlliances as alliance}
                        <tr class="border-b border-gray-700 hover:bg-gray-600 transition-colors duration-300">
                            <td class="px-2 py-1">{alliance.name}</td>
                            <td class="px-2 py-1">{alliance.kills}</td>
                            <td class="px-2 py-1">{convertIskToBillions(alliance.totalValue)} ISK</td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    </div>

    <!-- Red Team Alliances -->
    <div>
        <div class="mb-2 text-lg font-bold">Red Team Alliances</div>
        <div class="overflow-x-auto" role="table">
            <table class="table-auto min-w-full bg-semi-transparent bg-gray-800 rounded-lg shadow-lg">
                <thead>
                    <tr class="bg-darker text-white uppercase text-xs leading-normal">
                        <th class="px-2 py-1" scope="col">Alliance</th>
                        <th class="px-2 py-1" scope="col">Kills</th>
                        <th class="px-2 py-1" scope="col">Total Value</th>
                    </tr>
                </thead>
                <tbody class="text-gray-300 text-sm">
                    {#each redTeamAlliances as alliance}
                        <tr class="border-b border-gray-700 hover:bg-gray-600 transition-colors duration-300">
                            <td class="px-2 py-1">{alliance.name}</td>
                            <td class="px-2 py-1">{alliance.kills}</td>
                            <td class="px-2 py-1">{convertIskToBillions(alliance.totalValue)} ISK</td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    </div>
</div>
