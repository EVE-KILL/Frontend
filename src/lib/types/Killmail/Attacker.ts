export interface Attacker {
	ship_id: number;
	ship_name: string;
	ship_image_url: string;
	ship_group_id: number;
	character_id: number;
	character_name: string;
	character_image_url: string;
	corporation_id: number;
	corporation_name: string;
	corporation_image_url: string;
	alliance_id: number;
	alliance_name: string;
	alliance_image_url: string;
	faction_id: number;
	faction_name: string;
	faction_image_url: string;
	security_status: number;
	damage_done: number;
	final_blow: boolean;
	weapon_type_id: number;
	weapon_type_name: string;
	points: number;
}
