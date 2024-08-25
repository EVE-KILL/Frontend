// src/lib/stores/session.ts
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

const { subscribe, set, update } = writable(defaultMeta);

export const meta = {
    subscribe,
    set,
    update,
    reset: () => set(defaultMeta)
};

export const setMeta = (newMeta) => {
    meta.set(newMeta);
};

export const resetMeta = () => {
    meta.reset();
};

export const getMeta = () => {
    return meta;
}

// console.log anytime there is a change
meta.subscribe(value => console.log('Meta:', value));
