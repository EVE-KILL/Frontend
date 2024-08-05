import type { RequestHandler } from '@sveltejs/kit';
import { getUpstreamUrl, getPublicDomain } from '$lib/Config';

export const GET: RequestHandler = async ({ params }) => {
    const { id } = params;
    const upstreamUrl = getUpstreamUrl();
    const publicDomain = getPublicDomain();
    const sitemapUrl = `${upstreamUrl}/api/sitemap/${id}`;
    const response = await fetch(sitemapUrl);
    const data = await response.json();

    const subSitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
            xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
        ${data.map((item: any) => `
            <url>
                <loc>${`${publicDomain}${item.loc}`}</loc>
                <changefreq>${item.changefreq}</changefreq>
                <priority>${item.priority}</priority>
                <lastmod>${item.lastmod}</lastmod>
                <image:image>
                    <image:loc>${item.image}</image:loc>
                </image:image>
            </url>`).join('')}
    </urlset>`;

    return new Response(subSitemap, {
        headers: {
            'Content-Type': 'application/xml'
        }
    });
};
