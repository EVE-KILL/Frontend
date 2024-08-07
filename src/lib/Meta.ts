// src/lib/meta.ts
import { writable } from 'svelte/store';

const defaultMeta = {
    title: 'EVE-KILL',
    description: 'EVE-KILL is a killboard for the MMORPG EVE-Online',
    keywords: 'eve-online, eve, ccp, ccp games, kills, kills, killboard, eve-kill, eve-kill.net, eve-kill.com',
    robots: 'index, follow',
    upstreamUrl: 'https://eve-kill.com',
    siteName: 'EVE-KILL',
    creator: '@eve_kill',
    site: '@eve_kill',
    image: '/icon.png',
    hasCustomMeta: false
};

export const meta = writable({ ...defaultMeta });

export function setMeta(newMeta: Partial<typeof defaultMeta>, options: { prepend?: boolean; append?: boolean } = {}) {
    meta.update(currentMeta => {
        let updatedTitle = newMeta.title;

        if (options.prepend && updatedTitle) {
            updatedTitle = `${updatedTitle} | ${currentMeta.title}`;
        } else if (options.append && updatedTitle) {
            updatedTitle = `${currentMeta.title.split('|')[0].trim()} | ${updatedTitle}`;
        } else if (!updatedTitle) {
            updatedTitle = currentMeta.title;
        }

        const updatedDescription = newMeta.description || currentMeta.description;
        const updatedKeywords = newMeta.keywords || currentMeta.keywords;
        const updatedRobots = newMeta.robots || currentMeta.robots;
        const updatedUpstreamUrl = newMeta.upstreamUrl || currentMeta.upstreamUrl;
        const updatedSiteName = newMeta.siteName || currentMeta.siteName;
        const updatedCreator = newMeta.creator || currentMeta.creator;
        const updatedSite = newMeta.site || currentMeta.site;
        const updatedImage = newMeta.image || currentMeta.image;

        return {
            ...currentMeta,
            ...newMeta,
            title: updatedTitle,
            description: updatedDescription,
            keywords: updatedKeywords,
            robots: updatedRobots,
            upstreamUrl: updatedUpstreamUrl,
            siteName: updatedSiteName,
            creator: updatedCreator,
            site: updatedSite,
            image: updatedImage,
            hasCustomMeta: true
        };
    });
}

export function resetMeta() {
    meta.set({ ...defaultMeta });
}
