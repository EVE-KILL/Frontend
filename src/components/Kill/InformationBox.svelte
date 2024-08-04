<script lang="ts">
    import { formatNumber } from '$lib/Helpers.ts';
    import type { Item } from '../../types/Killmail/Item';

    export let killmail;

    function itemDroppedIsk(items: Item[]) {
        let total = 0;
        items.forEach((item) => {
            if (item.qty_dropped > 0) {
                total += item.value * item.qty_dropped;
            }
            if (item.container_items && item.container_items.length > 0) {
                item.container_items.forEach((containerItem) => {
                    if (containerItem.qty_dropped > 0) {
                        total += containerItem.value * containerItem.qty_dropped;
                    }
                });
            }
        });
        return total;
    }

    function itemDestroyedIsk(items: Item[]) {
        let total = 0;
        items.forEach((item) => {
            if (item.qty_destroyed > 0) {
                total += item.value * item.qty_destroyed;
            }
            if (item.container_items && item.container_items.length > 0) {
                item.container_items.forEach((containerItem) => {
                    if (containerItem.qty_destroyed > 0) {
                        total += containerItem.value * containerItem.qty_destroyed;
                    }
                });
            }
        });
        return total;
    }

    function getSecurityColor(status: number) {
        const normalizedStatus = (status + 1) / 2;
        const red = Math.round(255 * (1 - normalizedStatus));
        const green = Math.round(255 * normalizedStatus);
        return `rgb(${red}, ${green}, 0)`;
    }

    const droppedIsk = itemDroppedIsk(killmail.items);
    const destroyedIsk = itemDestroyedIsk(killmail.items);
    const shipPrice = killmail.total_value - (droppedIsk + destroyedIsk);
</script>

<div class="ml-5">
    <div class="w-full flex flex-col items-start">
        <div class="flex justify-start items-start">
            <!-- Character and Corporation Info -->
            <a href={`/character/${killmail.victim.character_id}/`} class="mr-2">
                <img
                    src={`https://images.evetech.net/characters/${killmail.victim.character_id}/portrait?size=128`}
                    alt={killmail.victim.character_name}
                    class="h-32 w-32 rounded-md"
                />
            </a>
            <div class="flex flex-col justify-center">
                <a href={`/corporation/${killmail.victim.corporation_id}/`}>
                    <img
                        src={`https://images.evetech.net/corporations/${killmail.victim.corporation_id}/logo?size=64`}
                        alt={killmail.victim.corporation_name}
                        class="h-16 w-16 rounded-md"
                    />
                </a>
                {#if killmail.victim.alliance_id > 0}
                    <a href={`/alliance/${killmail.victim.alliance_id}/`}>
                        <img
                            src={`https://images.evetech.net/alliances/${killmail.victim.alliance_id}/logo?size=64`}
                            alt={killmail.victim.alliance_name}
                            class="h-16 w-16 rounded-md"
                        />
                    </a>
                {/if}
            </div>
        </div>
    </div>
    <table class="table-auto w-full text-left mt-2 text-sm">
        <tbody>
            <tr>
                <th class="p-1">Character:</th>
                <td class="p-1">
                    <a href={`/character/${killmail.victim.character_id}/`} class="text-lg text-lime-400">
                        {killmail.victim.character_name}
                    </a>
                </td>
            </tr>
            <tr>
                <th class="p-1">Corporation:</th>
                <td class="p-1">
                    <a href={`/corporation/${killmail.victim.corporation_id}/`} class="text-sm text-lime-400">
                        {killmail.victim.corporation_name}
                    </a>
                </td>
            </tr>
            {#if killmail.victim.alliance_id > 0}
                <tr>
                    <th class="p-1">Alliance:</th>
                    <td class="p-1">
                        <a href={`/alliance/${killmail.victim.alliance_id}/`} class="text-sm text-lime-400">
                            {killmail.victim.alliance_name}
                        </a>
                    </td>
                </tr>
            {/if}
            {#if killmail.victim.faction_id > 0}
                <tr>
                    <th class="p-1">Faction:</th>
                    <td class="p-1">
                        <a href={`/faction/${killmail.victim.faction_id}/`} class="text-sm text-lime-400">
                            {killmail.victim.faction_name}
                        </a>
                    </td>
                </tr>
            {/if}
            <tr>
                <th class="p-1">Ship:</th>
                <td class="p-1">
                    <a href={`/item/${killmail.victim.ship_id}/`} class="text-lime-400">
                        {killmail.victim.ship_name}
                    </a>
                    <small class="text-gray-500">
                        (<a href={`/group/${killmail.victim.ship_group_id}/`} class="text-gray-400">
                            {killmail.victim.ship_group_name}
                        </a>)
                    </small>
                </td>
            </tr>
            <tr>
                <th class="p-1">System:</th>
                <td class="p-1">
                    <a href={`/system/${killmail.system_id}/`} class="text-lime-400">
                        {killmail.system_name}
                    </a>
                    <span class="text-gray-500">
                        (<span style={`color: ${getSecurityColor(killmail.system_security)}`}>
                            {formatNumber(killmail.system_security)}
                        </span>)
                    </span>
                </td>
            </tr>
            <tr>
                <th class="p-1">Region:</th>
                <td class="p-1">
                    <a href={`/region/${killmail.region_id}/`} class="text-lime-400">
                        {killmail.region_name}
                    </a>
                </td>
            </tr>
            {#if killmail.near != ''}
                <tr>
                    <th class="p-1">Location:</th>
                    <td class="p-1">{killmail.near}</td>
                </tr>
            {/if}
            <tr>
                <th class="p-1">Time:</th>
                <td class="p-1">{killmail.kill_time}</td>
            </tr>
            <tr>
                <th class="p-1">Points:</th>
                <td class="p-1">{killmail.point_value}</td>
            </tr>
            <tr>
                <th class="p-1">Damage:</th>
                <td class="p-1">{formatNumber(killmail.victim.damage_taken, 0)}</td>
            </tr>
            <tr>
                <th class="p-1">Dropped:</th>
                <td class="p-1 font-bold text-green-500">{formatNumber(droppedIsk)} ISK</td>
            </tr>
            <tr>
                <th class="p-1">Destroyed:</th>
                <td class="p-1 font-bold text-red-500">{formatNumber(destroyedIsk)} ISK</td>
            </tr>
            <tr>
                <th class="p-1">Ship:</th>
                <td class="p-1 font-bold">{formatNumber(shipPrice)} ISK</td>
            </tr>
            <tr>
                <th class="p-1">Total:</th>
                <td class="p-1 font-bold">{formatNumber(killmail.total_value)} ISK</td>
            </tr>
        </tbody>
    </table>
</div>
