import { getUpstreamUrl } from '$lib/Config';
import { formatNumber } from '$lib/Helpers.js';

import type { Killmail } from '$lib/types/Killmail.js';
const upstreamUrl = getUpstreamUrl();

export async function load({ params }) {
	const response = await fetch(`${upstreamUrl}/api/killmail/${params.id}`);
	let killmail: Killmail = await response.json();

	// If the victim ship_id is 670 or 33328, we need to fetch the sibling killmail
	let sibling: Killmail | null = null;
	if (killmail.victim.ship_id === 670 || killmail.victim.ship_id === 33328) {
		const siblingResponse = await fetch(`${upstreamUrl}/api/killmail/${params.id}/sibling`);
		const siblingIds: number[] = await siblingResponse.json();
		// If there is a sibling, we will get an array with a single id back, so we need to fetch the killmail again
		if (siblingIds.length === 1) {
			const siblingResponse = await fetch(`${upstreamUrl}/api/killmail/${siblingIds[0]}`);
			sibling = await siblingResponse.json();
		}
	}

	return {
		killmail,
		sibling,
		meta: {
			// ShipName | VictimName | SystemName | RegionName | EVE-KILL
			title: `${killmail.victim.ship_name} | ${killmail.victim.character_name} | ${killmail.system_name} | ${killmail.region_name}`,
			description: generateDescription(killmail),
			image: `https://images.eve-kill.com/types/${killmail.victim.ship_id}/render?size=128`
		}
	};
}

function generateDescription(killmail: Killmail): string {
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
