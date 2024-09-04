import { esiFlagToEsfSlot } from '@eveshipfit/react';
import type { Killmail } from '../types/Killmail';
import type { Item } from '../types/Killmail/Item';

export function itemSlotTypes() {
	return {
		'High Slot': [27, 28, 29, 30, 31, 32, 33, 34],
		'Medium Slot': [19, 20, 21, 22, 23, 24, 25, 26],
		'Low Slot': [11, 12, 13, 14, 15, 16, 17, 18],
		'Rig Slot': [92, 93, 94, 95, 96, 97, 98, 99],
		Subsystem: [125, 126, 127, 128, 129, 130, 131, 132],
		'Drone Bay': [87],
		'Cargo Bay': [5],
		'Fuel Bay': [133],
		'Fleet Hangar': [155],
		'Fighter Bay': [158],
		'Fighter Launch Tubes': [159, 160, 161, 162, 163],
		'Ship Hangar': [90],
		'Ore Hold': [134],
		'Gas hold': [135],
		'Mineral hold': [136],
		'Salvage Hold': [137],
		'Ship Hold': [138],
		'Small Ship Hold': [139],
		'Medium Ship Hold': [140],
		'Large Ship Hold': [141],
		'Industrial Ship Hold': [142],
		'Ammo Hold': [143],
		'Quafe Bay': [154],
		'Structure Services': [164, 165, 166, 167, 168, 169, 170, 171],
		'Structure Fuel': [172],
		'Infrastructure Hangar': [185],
		Implants: [89]
	};
}

export async function generateEveShipFit(killmail: Killmail) {
	type KillMailItem = {
		flag: number;
		type_id: number;
		quantity: number;
	};

	let items: KillMailItem[] = [];
	let modules = [];
	let drones = [];
	let cargo = [];

	items = killmail.items
		.map(
			(item: {
				flag: number;
				item_type_id: number;
				type_name: string;
				qty_destroyed?: number;
				qty_dropped?: number;
			}) => {
				return {
					flag: item.flag,
					type_id: item.type_id,
					category_id: item.category_id,
					quantity: (item.qty_dropped ?? 0) + (item.qty_destroyed ?? 0)
				};
			}
		);
	/* Find the modules from the item-list. */
	modules = items
		.map((item) => {
			if (esiFlagToEsfSlot[item.flag] === undefined) return undefined; // Skip anything not modules.

			return {
				slot: esiFlagToEsfSlot[item.flag],
				typeId: item.type_id,
				categoryId: item.category_id,
				charge: undefined,
				state: 'Active'
			};
		})
		.filter((item) => item !== undefined);

	/* Find the drones from the item-list. */
	drones = items
		.map((item) => {
			if (item.flag !== 87) return undefined; // Skip anything not drones.

			return {
				typeId: item.type_id,
				states: {
					Active: item.quantity,
					Passive: 0
				}
			};
		})
		.filter((item) => item !== undefined);

	/* Find the cargo from the item-list. */
	cargo = items
		.map((item) => {
			if (item.flag !== 5) return undefined; // Skip anything not cargo.

			return {
				typeId: item.type_id,
				quantity: item.quantity
			};
		})
		.filter((item) => item !== undefined);

	modules = modules
		.map((moduleOrCharge) => {
			if (moduleOrCharge.categoryId !== 8) return moduleOrCharge;

			const module = modules.find(
				(itemModule) =>
					itemModule.slot === moduleOrCharge.slot &&
					itemModule.typeId !== moduleOrCharge.typeId
			);

			if (module !== undefined) {
				module.charge = {
					typeId: moduleOrCharge.typeId
				};
			}

			return undefined;
		})
		.filter((item) => item !== undefined);

	return {
		shipTypeId: killmail.victim.ship_id,
		name: `Killmail ${killmail.killmail_id}`,
		description: '',
		modules,
		drones,
		cargo
	};
}

export function itemDroppedIsk(items: Item[]) {
	let total = 0;
	items.forEach((item) => {
		if (item.qty_dropped > 0) {
			total += item.value * item.qty_dropped;
		}
		if (item.container_items && item.container_items.length > 0) {
			item.container_items.forEach((containerItem) => {
				if (containerItem.qty_dropped > 0) {
					total += containerItem.value * containerItem.qty_dropped;
				}
			});
		}
	});
	return total;
}

export function itemDestroyedIsk(items: Item[]) {
	let total = 0;
	items.forEach((item) => {
		if (item.qty_destroyed > 0) {
			total += item.value * item.qty_destroyed;
		}
		if (item.container_items && item.container_items.length > 0) {
			item.container_items.forEach((containerItem) => {
				if (containerItem.qty_destroyed > 0) {
					total += containerItem.value * containerItem.qty_destroyed;
				}
			});
		}
	});
	return total;
}
