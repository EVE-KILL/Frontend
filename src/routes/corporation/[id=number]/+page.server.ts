import { backendFetch } from '$lib/backendFetcher';
import { getUpstreamUrl } from '$lib/Config';
import type { Corporation } from '$lib/types/Corporation.js';
const upstreamUrl = getUpstreamUrl();

export async function load({ params }) {
	const response = await backendFetch(`${upstreamUrl}/api/corporations/${params.id}`);
	let corporation: Corporation = await response.json();

	return {
		corporation,
		meta: {
			// ShipName | VictimName | SystemName | RegionName | EVE-KILL
			title: `${corporation.name}`,
			description: `Corporation: ${corporation.name} | Alliance: ${corporation.alliance_name}`,
			image: `${getUpstreamUrl()}/images/corporations/${corporation.corporation_id}/logo?size=128`
		}
	};
}
