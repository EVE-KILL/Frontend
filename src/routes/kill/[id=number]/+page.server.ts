// src/routes/kill/[id]/+page.server.ts
import { getUpstreamUrl, getKeywords, getRobots, getCreator, getSite } from '$lib/Config';

export async function load({ params }) {
    const { id } = params;
    const upstreamUrl = getUpstreamUrl();

    // Fetch killmail data
    const response = await fetch(`${upstreamUrl}/api/killmail/${id}`);
    const killmail = await response.json();

    // Generate custom description
    const generateDescription = (killmail) => {
        let description = `${killmail.victim.character_name} (${killmail.victim.corporation_name}) lost their ${killmail.victim.ship_name} in ${killmail.system_name} (${killmail.region_name}). `;
        description += `Final Blow by `;
        // Loop through attackers to find the one with final_blow: true
        for (let i = 0; i < killmail.attackers.length; i++) {
            if (killmail.attackers[i].final_blow) {
                description += `${killmail.attackers[i].character_name} (${killmail.attackers[i].corporation_name}) flying in a ${killmail.attackers[i].ship_name}. `;
                break;
            }
        }
        description += `Total Value: ${killmail.total_value} ISK`;
        return description;
    };

    const description = generateDescription(killmail);
    const image = `https://images.evetech.net/types/${killmail.victim.ship_id}/render?size=128`;

    return {
        id,
        killmail,
        upstreamUrl,
        siteName: `Killmail ${id}`,
        description,
        keywords: getKeywords(),
        robots: getRobots(),
        creator: getCreator(),
        site: getSite(),
        image
    };
}
