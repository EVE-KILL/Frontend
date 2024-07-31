export interface Fitting {
	shipTypeId: number;
	name: string;
	description: string;
	modules: { slot: string; typeId: number; charge: number | undefined; state: string }[];
	drones: { typeId: number; states: { Active: number; Passive: number } }[];
	cargo: { typeId: number; quantity: number }[];
}
