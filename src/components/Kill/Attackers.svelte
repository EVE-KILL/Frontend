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
    <table class="table-auto bg-semi-transparent bg-gray-800 rounded-lg shadow-lg">
        <thead>
            <tr class="bg-darker text-white uppercase text-xs leading-normal">
                <th class="px-2 py-1" scope="col"></th>
                <th class="px-2 py-1" scope="col"></th>
                <th class="px-2 py-1" scope="col"></th>
                <th class="px-2 py-1" scope="col">Damage</th>
            </tr>
        </thead>
        <tbody class="text-gray-300 text-sm">
            {#each attackers as attacker}
                <tr class="border-b border-gray-700 hover:bg-gray-600 transition-colors duration-300">
                    <td class="px-2 py-1">
                        <a href={`/character/${attacker.character_id}`}>
                            <img
                                src={`${attacker.character_image_url}?size=128`}
                                alt={attacker.character_name}
                                class="h-16 w-16 rounded-md"
                            />
                        </a>
                    </td>
                    <td class="px-2 py-1">
                        <img
                            src={attacker.ship_image_url}
                            alt={attacker.ship_name}
                            class="h-8 w-8 rounded-md"
                        />
                        <img
                            src={attacker.weapon_type_id === 0
                                ? `https://images.evetech.net/types/${attacker.ship_id}/icon?size=64`
                                : `https://images.evetech.net/types/${attacker.weapon_type_id}/icon?size=64`}
                            alt={attacker.weapon_type_name}
                            class="h-8 w-8 rounded-md"
                        />
                    </td>
                    <td class="px-2 py-1">
                        {#if attacker.character_id}
                            <div>
                                <a href={`/character/${attacker.character_id}`} class="text-blue-400 hover:underline">
                                    {attacker.character_name}
                                </a>
                            </div>
                        {/if}
                        {#if attacker.corporation_id}
                            <div>
                                <a href={`/corporation/${attacker.corporation_id}`} class="text-blue-400 hover:underline">
                                    {attacker.corporation_name}
                                </a>
                            </div>
                        {/if}
                        {#if attacker.alliance_id}
                            <div>
                                <a href={`/alliance/${attacker.alliance_id}`} class="text-blue-400 hover:underline">
                                    {attacker.alliance_name}
                                </a>
                            </div>
                        {/if}
                        {#if countMissing(attacker) >= 2}
                            <div>{attacker.ship_name}</div>
                            <div>{attacker.ship_group_name}</div>
                        {/if}
                    </td>
                    <td class="px-2 py-1">
                        <div>{attacker.damage_done}</div>
                        <div>{((attacker.damage_done / totalDamage) * 100).toFixed(1)}%</div>
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>

<style>
    .dropped-items {
        background-color: rgba(21, 255, 0, 0.1);
    }

    .destroyed-items {
        background-color: rgba(255, 0, 0, 0.117);
    }
</style>
