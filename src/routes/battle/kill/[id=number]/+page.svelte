<script lang="ts">
    import { getUpstreamUrl } from '$lib/Config';
    import { onMount } from 'svelte';
    import type Killmail from '../../../types/Killmail.ts';
    import { formatNumber } from '$lib/Helpers.ts';

    export let data;
    const upstreamUrl = getUpstreamUrl();

    let killmail_id = data.id;
    let battle;
    let blueTeamKills: Killmail[] = [];
    let redTeamKills: Killmail[] = [];
    let killmailUrl: string = `${upstreamUrl}/api/killmail`;

    onMount(async () => {
        let battleUrl = `${upstreamUrl}/api/battles/killmail/${killmail_id}`;
        const response = await fetch(battleUrl);
        battle = await response.json();
        console.log(battle);

        // Fetch killmails for Blue Team
        blueTeamKills = await fetchKillmails(Object.keys(battle.blue_team.kills));

        // Fetch killmails for Red Team
        redTeamKills = await fetchKillmails(Object.keys(battle.red_team.kills));
    });

    async function fetchKillmails(killmailIds) {
        // Convert the killmailIds to numeric values
        const numericKillmailIds = killmailIds.map(id => Number(id));

        const response = await fetch(killmailUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(numericKillmailIds)
        });

        return await response.json();
    }

    function truncateString(str: string, num: number) {
        return str.length <= num ? str : str.slice(0, num) + '...';
    }

    function duration(start, end) {
        const startTime = new Date(start);
        const endTime = new Date(end);
        const duration = endTime - startTime;

        const hours = Math.floor(duration / 3600000);
        const minutes = Math.floor((duration % 3600000) / 60000);

        return `${hours}h ${minutes}m`;
    }
</script>

<div class="p-4 bg-gray-900 rounded-lg shadow-lg text-white">
    {#if battle}
        <!-- Top Div -->
        <div class="mb-4">
            <div class="text-lg font-bold">
                Battle in System: {battle.system_name} ({battle.system_security_status}) - {battle.region_name}
            </div>
            <div class="text-sm text-gray-400">
                Start Time: {battle.start_time} | End Time: {battle.end_time}
            </div>
            <div class="text-sm text-gray-400">
                ISK Lost: {battle.total_value} ISK | Pilots Involved: {battle.total_characters} | Corporations: {battle.total_corporations} | Alliances: {battle.total_alliances}
            </div>
            <div class="text-sm text-gray-400">
                Duration: {duration(battle.start_time, battle.end_time)}
            </div>
        </div>

        <!-- Teams Table -->
        <div class="grid grid-cols-2 gap-4">
            <div>
                <div class="mb-2 text-lg font-bold">Blue Team</div>
                <div class="bg-gray-800 p-2 rounded-lg shadow-lg">
                    <div class="mb-2 text-sm text-gray-400">
                        ISK Lost: {battle.blue_team.value} ISK | Ships Lost: {battle.blue_team.total_ship_count} | Damage Inflicted: {battle.blue_team.points}
                    </div>
                    <div class="mb-2 text-sm text-gray-400">Alliances:</div>
                    <ul class="list-disc list-inside">
                        {#each battle.blue_team.alliances as alliance}
                            <li>{alliance.name}</li>
                        {/each}
                    </ul>
                </div>
            </div>
            <div>
                <div class="mb-2 text-lg font-bold">Red Team</div>
                <div class="bg-gray-800 p-2 rounded-lg shadow-lg">
                    <div class="mb-2 text-sm text-gray-400">
                        ISK Lost: {battle.red_team.value} ISK | Ships Lost: {battle.red_team.total_ship_count} | Damage Inflicted: {battle.red_team.points}
                    </div>
                    <div class="mb-2 text-sm text-gray-400">Alliances:</div>
                    <ul class="list-disc list-inside">
                        {#each battle.red_team.alliances as alliance}
                            <li>{alliance.name}</li>
                        {/each}
                    </ul>
                </div>
            </div>
        </div>

        <!-- Kills List -->
        <div class="mt-4 grid grid-cols-2 gap-4">
            <!-- Blue Team Kills -->
            <div>
                <div class="mb-2 text-lg font-bold">Blue Team Kills</div>
                <div class="overflow-x-auto" role="table">
                    <table class="table-auto min-w-full bg-semi-transparent bg-gray-800 rounded-lg shadow-lg">
                        <thead>
                            <tr class="bg-darker text-white uppercase text-xs leading-normal">
                                <th class="px-2 py-1 w-[64px]" scope="col"></th>
                                <th class="px-2 py-1" scope="col">Ship</th>
                                <th class="px-2 py-1 w-[64px]" scope="col"></th>
                                <th class="px-2 py-1" scope="col">Victim</th>
                                <th class="px-2 py-1" scope="col">Final Blow</th>
                            </tr>
                        </thead>
                        <tbody class="text-gray-300 text-sm">
                            {#each blueTeamKills as kill}
                                <tr class="border-b border-gray-700 hover:bg-gray-600 transition-colors duration-300" on:click={() => { window.location.href = `/kill/${kill.killmail_id}`; }}>
                                    <td class="px-2 py-1">
                                        <img src="{kill.victim.ship_image_url}?size=64" alt="Ship: {kill.victim.ship_name}" class="w-10 rounded" />
                                    </td>
                                    <td class="px-2 py-1">
                                        {truncateString(kill.victim.ship_name, 20)}<br />
                                        {#if kill.total_value > 50}
                                            <span class="text-gray-400">{formatNumber(kill.total_value)} ISK</span>
                                        {/if}
                                    </td>
                                    <td class="px-2 py-1">
                                        <img src="{kill.victim.character_image_url}?size=64" alt="Character: {kill.victim.character_name}" class="w-10 rounded" />
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
                                </tr>
                            {/each}
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Red Team Kills -->
            <div>
                <div class="mb-2 text-lg font-bold">Red Team Kills</div>
                <div class="overflow-x-auto" role="table">
                    <table class="table-auto min-w-full bg-semi-transparent bg-gray-800 rounded-lg shadow-lg">
                        <thead>
                            <tr class="bg-darker text-white uppercase text-xs leading-normal">
                                <th class="px-2 py-1 w-[64px]" scope="col"></th>
                                <th class="px-2 py-1" scope="col">Ship</th>
                                <th class="px-2 py-1 w-[64px]" scope="col"></th>
                                <th class="px-2 py-1" scope="col">Victim</th>
                                <th class="px-2 py-1" scope="col">Final Blow</th>
                            </tr>
                        </thead>
                        <tbody class="text-gray-300 text-sm">
                            {#each redTeamKills as kill}
                                <tr class="border-b border-gray-700 hover:bg-gray-600 transition-colors duration-300" on:click={() => { window.location.href = `/kill/${kill.killmail_id}`; }}>
                                    <td class="px-2 py-1">
                                        <img src="{kill.victim.ship_image_url}?size=64" alt="Ship: {kill.victim.ship_name}" class="w-10 rounded" />
                                    </td>
                                    <td class="px-2 py-1">
                                        {truncateString(kill.victim.ship_name, 20)}<br />
                                        {#if kill.total_value > 50}
                                            <span class="text-gray-400">{formatNumber(kill.total_value)} ISK</span>
                                        {/if}
                                    </td>
                                    <td class="px-2 py-1">
                                        <img src="{kill.victim.character_image_url}?size=64" alt="Character: {kill.victim.character_name}" class="w-10 rounded" />
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
                                </tr>
                            {/each}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    {:else}
        <div>Loading...</div>
    {/if}
</div>
