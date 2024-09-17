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

export const FILTER_PRESETS: { [key: string]: Function } = {
	none: () => {
		return {};
	},
	character: (params: { id: number; name: string }) => {
		return {
			involved_entities: [
				{
					entity_type: 'character',
					entity_id: params.id,
					entity_name: params.name,
					involved_as: 'both'
				}
			]
		};
	},
	corporation: (params: { id: number; name: string }) => {
		return {
			involved_entities: [
				{
					entity_type: 'corporation',
					entity_id: params.id,
					entity_name: params.name,
					involved_as: 'both'
				}
			]
		};
	}
};
