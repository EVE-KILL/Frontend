import moment from 'moment';

export const FILTER_PRESET_KEYS = {
	none: 'none',
	character: 'character',
	corporation: 'corporation',
	recent: 'recent',
	highsec: 'highsec',
	lowsec: 'lowsec',
	nullsec: 'nullsec',
	wspace: 'wspace',
	abyssal: 'abyssal',
	biggest: 'biggest',
	solo: 'solo',
	npc: 'npc',
	over5b: 'over5b',
	over10b: 'over10b',
	citadels: 'citadels',
	t1: 't1',
	t2: 't2',
	t3: 't3',
	frigates: 'frigates',
	destroyers: 'destroyers',
	cruisers: 'cruisers',
	battlecruisers: 'battlecruisers',
	battleships: 'battleships',
	capitals: 'capitals',
	freighters: 'freighters',
	supercapitals: 'supercapitals',
	titans: 'titans'
};

export const FILTER_PRESETS: { [key: string]: { label: string; filter: Function } } = {
	[FILTER_PRESET_KEYS.none]: {
		label: 'None',
		filter: () => {
			return {};
		}
	},
	[FILTER_PRESET_KEYS.character]: {
		label: 'Character',
		filter: (params: { id: number; name: string }) => {
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
		}
	},
	[FILTER_PRESET_KEYS.corporation]: {
		label: 'Corporation',
		filter: (params: { id: number; name: string }) => {
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
	},
	[FILTER_PRESET_KEYS.recent]: {
		label: 'Recent',
		filter: () => {
			return {
				kill_time: {
					// note these need to be unix timestamps
					lowest: moment().subtract(7, 'days').unix()
				}
			};
		}
	},
	[FILTER_PRESET_KEYS.highsec]: {
		label: 'Highsec',
		filter: () => {
			return {
				system_security: {
					lowest: 0.5,
					highest: 1.0
				}
			};
		}
	},
	[FILTER_PRESET_KEYS.lowsec]: {
		label: 'Lowsec',
		filter: () => {
			return {
				system_security: {
					lowest: 0.0,
					highest: 0.4
				}
			};
		}
	},
	[FILTER_PRESET_KEYS.nullsec]: {
		label: 'Nullsec',
		filter: () => {
			return {
				system_security: {
					lowest: -1.0,
					highest: 0.0
				}
			};
		}
	}
};
