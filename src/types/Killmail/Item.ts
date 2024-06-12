export interface Item {
	type_id: number;
	type_name: string;
	type_image_url: string;
	group_id: number;
	group_name: string;
	category_id: number;
	flag: number;
	qty_dropped: number;
	qty_destroyed: number;
	singleton: number;
	value: number;
}
