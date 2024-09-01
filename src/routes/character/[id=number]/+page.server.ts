import { getUpstreamUrl } from '$lib/Config';
import type { Character } from '../../../types/Character.js';
const upstreamUrl = getUpstreamUrl();

export async function load({ params }) {
    const response = await fetch(`${upstreamUrl}/api/characters/${params.id}`);
    let character: Character = await response.json();

    return {
        character,
        meta: {
            // ShipName | VictimName | SystemName | RegionName | EVE-KILL
            title: `${character.name}`,
            description: `Character: ${character.name} | Corporation: ${character.corporation_name} | Alliance: ${character.alliance_name}`,
        }
    }
}
