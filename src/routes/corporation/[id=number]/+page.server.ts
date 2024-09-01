import { getUpstreamUrl } from '$lib/Config';
import type { Corporation } from '../../../types/Corporation.js';
const upstreamUrl = getUpstreamUrl();

export async function load({ params }) {
    const response = await fetch(`${upstreamUrl}/api/corporations/${params.id}`);
    let corporation: Corporation = await response.json();

    return {
        corporation,
        meta: {
            // ShipName | VictimName | SystemName | RegionName | EVE-KILL
            title: `${corporation.name}`,
            description: `Corporation: ${corporation.name} | Alliance: ${corporation.alliance_name}`,
            image: `https://images.evetech.net/corporations/${corporation.corporation_id}/logo?size=128`
        }
    }
}
