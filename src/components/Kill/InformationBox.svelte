<script lang="ts">
    import { formatNumber } from '$lib/Helpers.ts';
    import { itemDestroyedIsk, itemDroppedIsk } from '$lib/Killmail.ts';

    export let killmail;

    function getSecurityColor(status: number) {
        const normalizedStatus = (status + 1) / 2;
        const red = Math.round(255 * (1 - normalizedStatus));
        const green = Math.round(255 * normalizedStatus);
        return `rgb(${red}, ${green}, 0)`;
    }
</script>

<div>
    <div class="w-full flex flex-col items-start rounded-lg shadow-lg custom-space-x mt-4">
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
                <th class="p-1 text-right">Character:</th>
                <td class="p-1">
                    <a href={`/character/${killmail.victim.character_id}/`} class="text-lime-400" style="font-weight: 500; font-size:larger">
                        {killmail.victim.character_name}
                    </a>
                </td>
            </tr>
            <tr>
                <th class="p-1 text-right">Corporation:</th>
                <td class="p-1">
                    <a href={`/corporation/${killmail.victim.corporation_id}/`} class="text-sm text-gray-400">
                        {killmail.victim.corporation_name}
                    </a>
                </td>
            </tr>
            {#if killmail.victim.alliance_id > 0}
                <tr>
                    <th class="p-1 text-right">Alliance:</th>
                    <td class="p-1">
                        <a href={`/alliance/${killmail.victim.alliance_id}/`} class="text-sm text-white-400">
                            {killmail.victim.alliance_name}
                        </a>
                    </td>
                </tr>
            {/if}
            {#if killmail.victim.faction_id > 0}
                <tr>
                    <th class="p-1 text-right">Faction:</th>
                    <td class="p-1">
                        <a href={`/faction/${killmail.victim.faction_id}/`} class="text-sm">
                            {killmail.victim.faction_name}
                        </a>
                    </td>
                </tr>
            {/if}
            <tr>
                <th class="p-1 text-right">Ship:</th>
                <td class="p-1">
                    <a href={`/item/${killmail.victim.ship_id}/`} class="text-lime-400" style="font-weight: 500; font-size:larger">
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
                <th class="p-1 text-right">System:</th>
                <td class="p-1">
                    <a href={`/system/${killmail.system_id}/`}>
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
                <th class="p-1 text-right">Region:</th>
                <td class="p-1">
                    <a href={`/region/${killmail.region_id}/`}>
                        {killmail.region_name}
                    </a>
                </td>
            </tr>
            {#if killmail.near != ''}
                <tr>
                    <th class="p-1 text-right">Location:</th>
                    <td class="p-1">{killmail.near}</td>
                </tr>
            {/if}
            <tr>
                <th class="p-1 text-right">Time:</th>
                <td class="p-1">{killmail.kill_time}</td>
            </tr>
            <tr>
                <th class="p-1 text-right">Points:</th>
                <td class="p-1">{formatNumber(killmail.point_value, 0)}</td>
            </tr>
            <tr>
                <th class="p-1 text-right">Damage:</th>
                <td class="p-1">{formatNumber(killmail.victim.damage_taken, 0)}</td>
            </tr>
        </tbody>
    </table>
</div>
