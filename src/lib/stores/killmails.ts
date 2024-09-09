import { writable } from 'svelte/store';

import type { KillmailFilters } from '$lib/types/killmailFilters';
import type { Killmail } from '$lib/types/Killmail';

export const killmailFilters = writable<KillmailFilters>({
	dateRange: {
		start: null,
		end: null
	},
	victim: {
		character_id: null,
		corporation_id: null,
		alliance_id: null,
		faction_id: null,
		ship_type_id: null,
		ship_group_id: null
	},
	attacker: {
		character_id: null,
		corporation_id: null,
		alliance_id: null,
		faction_id: null,
		ship_type_id: null,
		ship_group_id: null
	},
	location: {
		region_id: null,
		constellation_id: null,
		system_id: null
	},
	killedShip: {
		ship_type_id: null,
		ship_group_id: null,
		total_isk_value_greater_than: null,
		total_isk_value_less_than: null,
		ship_isk_value_greater_than: null,
		ship_isk_value_less_than: null
	},
	misc: {
		point_value_greater_than: null,
		point_value_less_than: null,
		flags: []
	}
});

export const killmails = writable<Killmail[]>([]);
