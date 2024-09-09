export interface System {
	constellation_id: number;
	constellation_name: string;
	count: number;
	name: string;
	position: Position;
	region_id: number;
	region_name: string;
	security_class: string;
	security_status: number;
	star_id: number;
	stargates: number[];
	system_id: number;
}

export interface Position {
	x: number;
	y: number;
	z: number;
}
