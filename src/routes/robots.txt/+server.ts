import type { RequestHandler } from '@sveltejs/kit';
import { getPublicDomain } from '$lib/Config';

export const GET: RequestHandler = async () => {
    const publicDomain = getPublicDomain();
    const robotsTxt = `
Sitemap: ${publicDomain}/sitemap.xml
`;

    return new Response(robotsTxt.trim(), {
        headers: {
            'Content-Type': 'text/plain'
        }
    });
};
