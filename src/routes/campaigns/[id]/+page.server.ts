import { backendFetch } from '$lib/backendFetcher.js';
import { getUpstreamUrl } from '$lib/Config';

const upstreamUrl = getUpstreamUrl();

export async function load({ params }) {
	let response = await backendFetch(`${upstreamUrl}/api/campaigns/${params.id}`);
	let campaign = await response.json();

	return {
		campaign,
		meta: {
			// ShipName | VictimName | SystemName | RegionName | EVE-KILL
			//title: `${killmail.victim.ship_name} | ${killmail.victim.character_name} | ${killmail.system_name} | ${killmail.region_name}`,
			//description: generateDescription(killmail),
			//image: `${getUpstreamUrl()}/images/types/${killmail.victim.ship_id}/render?size=128`
		}
	};
}
