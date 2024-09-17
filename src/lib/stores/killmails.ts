import { writable } from 'svelte/store';

import type { KillmailFilters } from '$lib/types/killmailFilters';
import type { KillmailData } from '$lib/types/KillmailData';

export const killmailFilters = writable<KillmailFilters>({
	killmail_id: undefined,
	war_id: undefined,
	is_npc: undefined,
	is_solo: undefined,
	region_id: undefined,
	system_id: undefined,
	system_security: undefined,
	total_value: undefined,
	kill_time: undefined,
	involved_entities: undefined
});

export const killmails = writable<KillmailData>();
