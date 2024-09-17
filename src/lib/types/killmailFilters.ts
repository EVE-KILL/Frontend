export interface KillmailFilters {
	killmail_id?: number;
	war_id?: number;
	is_npc?: boolean;
	is_solo?: boolean;
	region_id?: number;
	system_id?: number;
	system_security?: {
		lowest?: number;
		highest?: number;
	};
	total_value?: {
		lowest?: number;
		highest?: number;
	};
	kill_time?: {
		lowest?: string;
		highest?: string;
	};
	involved_entities?: {
		entity_type?: string;
		entity_id?: number;
		entity_name?: string;
		involved_as: string;
		ship_id?: number;
		ship_group_id?: number;
		weapon_type_id?: number;
	}[];
}
