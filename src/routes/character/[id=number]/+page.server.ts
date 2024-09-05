import { getUpstreamUrl } from '$lib/Config';
import type { Character } from '../../../types/Character.js';
const upstreamUrl = getUpstreamUrl();

export async function load({ params }) {
    const characterResponse = await fetch(`${upstreamUrl}/api/characters/${params.id}`);
    let character: Character = await characterResponse.json();

    return {
        character,
        meta: {
            title: `${character.name}`,
            description: `Character: ${character.name} | Corporation: ${character.corporation_name} | Alliance: ${character.alliance_name}`,
            image: `https://images.evetech.net/characters/${character.character_id}/portrait?size=128`
        }
    };
}
