// src/lib/Config.ts
export function getUpstreamUrl(): string {
	if (typeof window === 'undefined') {
		return process.env.VITE_BASE_URL || 'https://eve-kill.com';
	} else {
		return import.meta.env.VITE_BASE_URL || 'https://eve-kill.com';
	}
}
