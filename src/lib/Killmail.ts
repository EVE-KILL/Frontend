import { esiFlagToEsfSlot } from '@eveshipfit/react';
import type { Killmail } from '../types/Killmail';

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

	items = killmail.items.map(
		(item: {
			flag: number;
			item_type_id: number;
			qty_destroyed?: number;
			qty_dropped?: number;
		}) => {
			return {
				flag: item.flag,
				type_id: item.type_id,
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

	return {
		shipTypeId: killmail.victim.ship_id,
		name: `Killmail ${killmail.killmail_id}`,
		description: '',
		modules,
		drones,
		cargo
	};
}
