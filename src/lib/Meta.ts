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
    image: '/logo.png',
    hasCustomMeta: false
};

export const meta = writable({ ...defaultMeta });

export function setMeta(newMeta: Partial<typeof defaultMeta>, options: { prepend?: boolean; append?: boolean } = {}) {
    meta.update(currentMeta => {
        let updatedTitle = newMeta.title;

        if (options.prepend && updatedTitle) {
            updatedTitle = `${updatedTitle} | ${currentMeta.title}`;
        } else if (options.append && updatedTitle) {
            updatedTitle = `${currentMeta.title} | ${updatedTitle}`;
        } else if (!updatedTitle) {
            updatedTitle = currentMeta.title;
        }

        return {
            ...currentMeta,
            ...newMeta,
            title: updatedTitle,
            hasCustomMeta: true
        };
    });
}

export function resetMeta() {
    meta.update(() => ({
        ...defaultMeta,
        hasCustomMeta: false
    }));
}
