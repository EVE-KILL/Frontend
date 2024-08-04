// src/lib/Config.ts
export function getUpstreamUrl(): string {
    if (typeof window === 'undefined') {
        return process.env.VITE_BASE_URL || 'https://eve-kill.com';
    } else {
        return import.meta.env.VITE_BASE_URL || 'https://eve-kill.com';
    }
}

export function getPublicDomain(): string {
    if (typeof window === 'undefined') {
        return process.env.VITE_PUBLIC_DOMAIN || 'https://eve-kill.com';
    } else {
        return import.meta.env.VITE_PUBLIC_DOMAIN || 'https://eve-kill.com';
    }
}

export function getSiteName(): string {
    if (typeof window === 'undefined') {
        return process.env.VITE_SITE_NAME || 'EVE-KILL';
    } else {
        return import.meta.env.VITE_SITE_NAME || 'EVE-KILL';
    }
}

export function getDescription(): string {
    if (typeof window === 'undefined') {
        return process.env.VITE_DESCRIPTION || 'EVE-KILL is a killboard for the MMORPG EVE-Online';
    } else {
        return import.meta.env.VITE_DESCRIPTION || 'EVE-KILL is a killboard for the MMORPG EVE-Online';
    }
}

export function getKeywords(): string {
    if (typeof window === 'undefined') {
        return process.env.VITE_KEYWORDS || 'eve-online, eve, ccp, ccp games, kills, kills, killboard, eve-kill, eve-kill.net, eve-kill.com';
    } else {
        return import.meta.env.VITE_KEYWORDS || 'eve-online, eve, ccp, ccp games, kills, kills, killboard, eve-kill, eve-kill.net, eve-kill.com';
    }
}

export function getRobots(): string {
    if (typeof window === 'undefined') {
        return process.env.VITE_ROBOTS || 'index, follow';
    } else {
        return import.meta.env.VITE_ROBOTS || 'index, follow';
    }
}

export function getCreator(): string {
    if (typeof window === 'undefined') {
        return process.env.VITE_CREATOR || '@eve_kill';
    } else {
        return import.meta.env.VITE_CREATOR || '@eve_kill';
    }
}

export function getSite(): string {
    if (typeof window === 'undefined') {
        return process.env.VITE_SITE || '@eve_kill';
    } else {
        return import.meta.env.VITE_SITE || '@eve_kill';
    }
}
