<script lang="ts">
    import { formatNumber } from '$lib/Helpers.ts';
    import { onMount } from 'svelte';
    import type { Attacker } from '../../types/Killmail/Attacker.ts';

    export let attackers: Attacker[];
    let totalDamage: number;

    onMount(() => {
        totalDamage = calculateTotalDamage(attackers);
    });

    function calculateTotalDamage(attackers: Attacker[]) {
        return attackers.reduce((total, attacker) => total + attacker.damage_done, 0);
    }

    function countMissing(attacker: Attacker) {
        let count = 0;
        if (!attacker.character_id) count++;
        if (!attacker.corporation_id) count++;
        if (!attacker.alliance_id) count++;
        return count;
    }
</script>

<div class="overflow-x-auto" role="table">
    <table class="table-auto bg-semi-transparent bg-gray-800 rounded-lg shadow-lg w-full">
        <thead>
            <tr class="bg-darker text-white uppercase text-xs leading-normal">
                <th class="px-2 py-1" scope="col"></th>
                <th class="px-2 py-1" scope="col"></th>
                <th class="px-2 py-1" scope="col">Attackers</th>
                <th class="px-2 py-1" scope="col"></th>
            </tr>
        </thead>
        <tbody class="text-gray-300 text-sm">
            {#each attackers as attacker}
                <tr class="border-b border-gray-700 hover:bg-gray-600 transition-colors duration-300">
                    <td>
                        <a href={`/character/${attacker.character_id}`}>
                            <img
                                src={`${attacker.character_image_url}?size=128`}
                                alt={attacker.character_name}
                                class="h-16 min-h-16 w-16 min-w-16 rounded-md"
                            />
                        </a>
                    </td>
                    <td>
                        <div class="flex flex-col items-center">
                            <a href={`/ship/${attacker.ship_id}`}>
                                <img
                                    src={attacker.ship_image_url}
                                    alt={attacker.ship_name}
                                    class="h-8 min-h-8 w-8 min-w-8 rounded-md"
                                />
                            </a>
                            <a href={`/item/${attacker.weapon_type_id}`}>
                                <img
                                    src={attacker.weapon_type_id === 0
                                        ? `https://images.evetech.net/types/${attacker.ship_id}/icon?size=64`
                                        : `https://images.evetech.net/types/${attacker.weapon_type_id}/icon?size=64`}
                                    alt={attacker.weapon_type_name}
                                    class="h-8 min-h-8 w-8 min-w-8 rounded-md"
                                />
                            </a>
                        </div>
                    </td>
                    <td class="px-2 py-1">
                        <div>
                            {#if attacker.character_id}
                                <div>
                                    <a href={`/character/${attacker.character_id}`} class="text-lime-400 hover:underline">
                                        {attacker.character_name}
                                    </a>
                                    <span> (<a class="text-gray-400" href={`/ship/${attacker.ship_id}`}>{attacker.ship_name}</a>)</span>
                                </div>
                            {/if}
                            {#if attacker.corporation_id}
                                <div class="text-xs">
                                    <a href={`/corporation/${attacker.corporation_id}`} class="text-gray-400 hover:underline">
                                        {attacker.corporation_name}
                                    </a>
                                </div>
                            {/if}
                            {#if attacker.alliance_id}
                                <div>
                                    <a href={`/alliance/${attacker.alliance_id}`} class="text-white-400 hover:underline">
                                        {attacker.alliance_name}
                                    </a>
                                </div>
                            {/if}
                            {#if countMissing(attacker) >= 2}
                                <div>
                                    <a href={`/group/${attacker.ship_group_id}`} class="text-gray-400 hover:underline">
                                        {attacker.ship_group_name}
                                    </a>
                                </div>
                            {/if}
                        </div>
                    </td>
                    <td class="px-2 py-1 text-right">
                        <div>{formatNumber(attacker.damage_done, 0)}</div>
                        <div class="text-sm text-gray-500">{formatNumber(((attacker.damage_done / totalDamage) * 100).toFixed(1))}%</div>
                        <div class="flex justify-end mt-1">
                            {#if attacker.corporation_id}
                                <a href={`/corporation/${attacker.corporation_id}`}>
                                    <img
                                        src={`https://images.evetech.net/corporations/${attacker.corporation_id}/logo?size=64`}
                                        alt={attacker.corporation_name}
                                        class="h-8 w-8 rounded-md"
                                    />
                                </a>
                            {/if}
                            {#if attacker.alliance_id}
                                <a class="ml-1" href={`/alliance/${attacker.alliance_id}`}>
                                    <img
                                        src={`https://images.evetech.net/alliances/${attacker.alliance_id}/logo?size=64`}
                                        alt={attacker.alliance_name}
                                        class="h-8 min-h-8 w-8 min-w-8 rounded-md"
                                    />
                                </a>
                            {/if}
                        </div>
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>
