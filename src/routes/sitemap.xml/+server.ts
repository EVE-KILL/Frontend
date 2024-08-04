import type { RequestHandler } from '@sveltejs/kit';
import { getUpstreamUrl, getPublicDomain } from '$lib/Config';

export const GET: RequestHandler = async () => {
    const upstreamUrl = getUpstreamUrl();
    const publicDomain = getPublicDomain();
    let sitemapUrl = `${upstreamUrl}/api/sitemap`;
    const response = await fetch(sitemapUrl);
    const data = await response.json();

    const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
    <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${data.links.map((link: string) => `
            <sitemap>
                <loc>${`${publicDomain}${link}.xml`}</loc>
            </sitemap>`).join('')}
    </sitemapindex>`;

    return new Response(sitemapIndex, {
        headers: {
            'Content-Type': 'application/xml'
        }
    });
};
