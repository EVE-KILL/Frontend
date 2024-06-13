import type { Attacker } from './Killmail/Attacker';
import type { Item } from './Killmail/Item';
import type { Victim } from './Killmail/Victim';

export interface Killmail {
	attackers: Attacker[];
	items: Item[];
	victim: Victim;
	killmail_id: number;
	hash: string;
	dna: string;
	fitting_value: number;
	total_value: number;
	is_npc: boolean;
	is_solo: boolean;
	kill_time: string;
	last_modified: string;
	near: string;
	point_value: number;
	region_id: number;
	region_name: string;
	ship_value: number;
	system_id: number;
	system_name: string;
	system_security: number;
	war_id: number;
	x: number;
	y: number;
	z: number;
}
