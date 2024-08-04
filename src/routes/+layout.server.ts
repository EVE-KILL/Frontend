// src/routes/+layout.server.ts
import { getUpstreamUrl, getSiteName, getDescription, getKeywords, getRobots, getCreator, getSite } from '$lib/Config';

export function load() {
    return {
        upstreamUrl: getUpstreamUrl(),
        siteName: getSiteName(),
        description: getDescription(),
        keywords: getKeywords(),
        robots: getRobots(),
        creator: getCreator(),
        site: getSite()
    };
}
