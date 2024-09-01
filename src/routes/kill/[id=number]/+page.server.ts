import { getUpstreamUrl } from '$lib/Config';
import { formatNumber } from '$lib/Helpers.js';

import type { Killmail } from '../../../types/Killmail.js';
const upstreamUrl = getUpstreamUrl();

export async function load({ params }) {
    const response = await fetch(`${upstreamUrl}/api/killmail/${params.id}`);
    let killmail: Killmail = await response.json();

    return {
        killmail,
        meta: {
            // ShipName | VictimName | SystemName | RegionName | EVE-KILL
            title: `${killmail.victim.ship_name} | ${killmail.victim.character_name} | ${killmail.system_name} | ${killmail.region_name}`,
            description: generateDescription(killmail),
            image: `https://images.evetech.net/types/${killmail.victim.ship_id}/render?size=128`
        }
    }
}

function generateDescription(killmail: Killmail): string
{
    let description = `${killmail.victim.character_name} (${killmail.victim.corporation_name}) lost their ${killmail.victim.ship_name} in ${killmail.system_name} (${killmail.region_name}). `;
    description += `Final Blow by `;
    // Loop through attackers to find the one with final_blow: true
    for (let i = 0; i < killmail.attackers.length; i++) {
        if (killmail.attackers[i].final_blow) {
            description += `${killmail.attackers[i].character_name} (${killmail.attackers[i].corporation_name}) flying in a ${killmail.attackers[i].ship_name}. `;
            break;
        }
    }
    description += `Total Value: ${formatNumber(killmail.total_value, 0)} ISK`;
    return description;
}
