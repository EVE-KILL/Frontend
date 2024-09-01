import { getUpstreamUrl } from '$lib/Config';
import type { Alliance } from '../../../types/Alliance.js';
const upstreamUrl = getUpstreamUrl();

export async function load({ params }) {
    const response = await fetch(`${upstreamUrl}/api/alliances/${params.id}`);
    let alliance: Alliance = await response.json();

    return {
        alliance,
        meta: {
            // ShipName | VictimName | SystemName | RegionName | EVE-KILL
            title: `${alliance.name}`,
            description: `Alliance: ${alliance.name} | Executor Corporation: ${alliance.executor_corporation_name} | Member Count: ${alliance.member_count} | ${alliance.ticker}`,
            image: `https://images.evetech.net/alliances/${alliance.alliance_id}/logo?size=128`
        }
    }
}
