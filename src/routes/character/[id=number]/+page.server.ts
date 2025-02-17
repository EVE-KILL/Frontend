import { backendFetch } from '$lib/backendFetcher.js';
import { getUpstreamUrl } from '$lib/Config';
import type { Character } from '$lib/types/Character.js';
const upstreamUrl = getUpstreamUrl();

export async function load({ params }) {
	const characterResponse = await backendFetch(`${upstreamUrl}/api/characters/${params.id}`);
	const character: Character = await characterResponse.json();
	const corporationResponse = await backendFetch(`${upstreamUrl}/api/corporations/${character.corporation_id}`);
	const allianceResponse = await backendFetch(`${upstreamUrl}/api/alliances/${character.alliance_id}`);
	character.corporation_name = (await corporationResponse.json()).name;
	character.alliance_name = (await allianceResponse.json()).name;

	return {
		character,
		meta: {
			title: `${character.name}`,
			description: `Character: ${character.name} | Corporation: ${character.corporation_name} | Alliance: ${character.alliance_name}`,
			image: `${getUpstreamUrl()}/images/characters/${character.character_id}/portrait?size=128`
		}
	};
}
