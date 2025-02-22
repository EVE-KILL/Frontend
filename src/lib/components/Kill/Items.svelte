<script lang="ts">
	import { formatNumber } from '$lib/Helpers.ts';
	import { itemSlotTypes, itemDestroyedIsk, itemDroppedIsk } from '$lib/Killmail.ts';
	import { onMount } from 'svelte';
	import type { Item } from '$lib/types/Killmail/Item';
	import { getUpstreamUrl } from '$lib/Config';

	export let killmail;
	let groupedItems = [];
	let collapsibleSections = {};
	let defaultCollapsedState = {
		'High Slot': true,
		'Medium Slot': true,
		'Low Slot': true,
		'Rig Slot': true,
		Subsystem: false,
		'Drone Bay': false,
		'Cargo Bay': false,
		'Fuel Bay': false,
		'Fleet Hangar': false,
		'Fighter Bay': false,
		'Fighter Launch Tubes': false,
		'Ship Hangar': false,
		'Ore Hold': false,
		'Gas Hold': false,
		'Mineral Hold': false,
		'Salvage Hold': false,
		'Ship Hold': false,
		'Small Ship Hold': false,
		'Medium Ship Hold': false,
		'Large Ship Hold': false,
		'Industrial Ship Hold': false,
		'Ammo Hold': false,
		'Quafe Bay': false,
		'Structure Services': true,
		'Structure Fuel': false,
		Implants: true,
		'Infrastructure Hangar': false,
		'Core Room': false,
		'Moon Material Bay': false
	};

  // Reactively update groupedItems whenever killmail changes
  $: if (killmail) {
    const slotTypes = itemSlotTypes();
    let allItems = [];

    killmail.items.forEach((item) => {
      const containerItemsValue = item.items
        ? item.items.reduce(
            (sum, containerItem) => sum + containerItem.value * (containerItem.qty_dropped + containerItem.qty_destroyed),
            0
          )
        : 0;

      allItems.push({
        ...item,
        isContainer: !!item.items,
        items: item.items || [],
        containerItemsValue,
      });
    });

    groupedItems = Object.keys(slotTypes).map((slotType) => ({
      slotType,
      items: groupByQty(allItems.filter((item) => slotTypes[slotType].includes(item.flag))),
    }));

    groupedItems.forEach((group) => {
      collapsibleSections[group.slotType] = defaultCollapsedState[group.slotType] ?? true;
    });
  }

  function groupByQty(items: Item[]) {
    const grouped = items.reduce((acc, item) => {
      let key;
      if (item.type_id === 3468) {
        key = `${item.Itemid}_${item.type_id}_${Math.random()}`;
      } else {
        key = `${item.type_id}_${item.qty_dropped || 0}_${item.qty_destroyed || 0}`;
      }

      if (!acc[key]) {
        acc[key] = {
          ...item,
          qty_dropped: 0,
          qty_destroyed: 0,
          items: [],
          containerItemsValue: 0,
        };
      }

      acc[key].qty_dropped += item.qty_dropped || 0;
      acc[key].qty_destroyed += item.qty_destroyed || 0;

      if (item.isContainer) {
        acc[key].items = item.items;
        acc[key].containerItemsValue = item.containerItemsValue;
      }

      return acc;
    }, {});

    return Object.values(grouped);
  }

	function toggleCollapse(slotType) {
		collapsibleSections[slotType] = !collapsibleSections[slotType];
	}

	function getTotalValue(items) {
		return items.reduce((sum, item) => {
			const itemValue = item.value * (item.qty_destroyed + item.qty_dropped);
			const containerValue = item.containerItemsValue || 0;
			return sum + itemValue + containerValue;
		}, 0);
	}
</script>

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" />

<div class="w-full rounded-lg shadow-lg custom-space-x mt-4">
	<div class="overflow-x-auto" role="table">
		<table class="table-auto min-w-full bg-semi-transparent bg-background-800 rounded-lg shadow-lg">
			<thead>
				<tr class="bg-darker text-white uppercase text-xs leading-normal text-left">
					<th class="px-2 py-1 w-1" scope="col"></th>
					<th class="px-2 py-1 w-60" scope="col">Name</th>
					<th class="px-2 py-1 w-12" scope="col">Destroyed</th>
					<th class="px-2 py-1 w-12" scope="col">Dropped</th>
					<th class="px-2 py-1 w-12" scope="col">Value (ISK)</th>
					<th class="px-2 py-1 w-6" scope="col"></th>
				</tr>
			</thead>
			<tbody class="text-background-300 text-sm">
				<tr class="bg-background-700 text-white bg-semi-transparent">
					<td colspan="2" class="px-2 py-1"></td>
					<td colspan="1" class="px-2 py-1">{formatNumber(itemDestroyedIsk(killmail.items), 0)}</td>
					<td colspan="1" class="px-2 py-1">{formatNumber(itemDroppedIsk(killmail.items), 0)}</td>
					<td colspan="2" class="px-2 py-1">{formatNumber(killmail.total_value, 0)}</td>
				</tr>
				<tr id="item-header" class="bg-background-700 text-white">
					<td></td>
					<td colspan="5" class="px-2 py-1 font-bold">Hull</td>
				</tr>
				<tr class="destroyed-items">
					<td class="px-2 py-1">
						<img
							src={`https://images.eve-kill.com/types/${killmail.victim.ship_id}/icon?size=32`}
							loading="lazy"
							alt={killmail.victim.ship_name}
							class="h-8 min-h-8 w-8 min-w-8 rounded-md"
						/>
					</td>
					<td class="px-2 py-1">
						<a href={`/item/${killmail.victim.ship_id}`} class="hover:underline">
							{killmail.victim.ship_name}
						</a>
					</td>
					<td class="px-2 py-1">1</td>
					<td class="px-2 py-1">0</td>
					<td class="px-2 py-1">{formatNumber(killmail.total_value - (itemDroppedIsk(killmail.items) + itemDestroyedIsk(killmail.items)), 0)}</td>
					<td></td>
				</tr>
				{#each groupedItems as group}
					{#if group.items.length > 0}
						<tr id="item-header" class="bg-background-700 text-white cursor-pointer" on:click={() => toggleCollapse(group.slotType)}>
							<td></td>
							<td colspan="3" class="px-2 py-1 font-bold">{group.slotType}</td>
							<td class="px-2 py-1">{formatNumber(getTotalValue(group.items), 0)}</td>
							<td class="px-2 py-1">
								<i class={`fas fa-${collapsibleSections[group.slotType] ? 'arrow-down' : 'arrow-right'}`}></i>
							</td>
						</tr>
						{#if collapsibleSections[group.slotType]}
							{#each group.items as item}
								<tr
									class={`border-b border-background-700 hover:bg-background-600 transition-colors duration-30 ${item.qty_dropped > 0 ? 'dropped-items' : item.qty_destroyed > 0 ? 'destroyed-items' : ''}`}
								>
									<td class="pl-2 py-1">
										<img
											src={`https://images.eve-kill.com/types/${item.type_id}/icon?size=32`}
											loading="lazy"
											alt={item.type_name}
											class="h-8 min-h-8 w-8 min-w-8 rounded-md"
										/>
									</td>
									<td class="px-2 py-1">
										<a href={`/item/${item.type_id}`} class="hover:underline">
											{item.type_name}
										</a>
									</td>
									<td class="px-2 py-1">{formatNumber(item.qty_destroyed, 0)}</td>
									<td class="px-2 py-1">{formatNumber(item.qty_dropped, 0)}</td>
									<td class="px-2 py-1">
										{#if item.isContainer && item.containerItemsValue > 0}
											{formatNumber(item.value * (item.qty_destroyed + item.qty_dropped) + item.containerItemsValue, 0)}
										{:else}
											{formatNumber(item.value * (item.qty_destroyed + item.qty_dropped), 0)}
										{/if}
									</td>
									<td></td>
								</tr>
								{#if item.isContainer && item.items.length > 0}
									{#each item.items as containerItem}
										<tr
											class={`border-b border-background-700 hover:bg-background-600 transition-colors duration-30 pl-6 ${item.qty_dropped > 0 ? 'dropped-items' : item.qty_destroyed > 0 ? 'destroyed-items' : ''}`}
										>
											<td class="px-2 py-1 pl-5">
												<img
													src={`https://images.eve-kill.com/types/${containerItem.type_id}/icon?size=32`}
													loading="lazy"
													alt={containerItem.type_name}
													class="h-8 min-h-8 w-8 min-w-8 rounded-md"
												/>
											</td>
											<td class="px-2 py-1">
												<a href={`/item/${containerItem.type_id}`} class="hover:underline">
													{containerItem.type_name}
												</a>
											</td>
											<td class="px-2 py-1">{containerItem.qty_destroyed}</td>
											<td class="px-2 py-1">{containerItem.qty_dropped}</td>
											<td class="px-2 py-1">
												{formatNumber(containerItem.value * (containerItem.qty_destroyed + containerItem.qty_dropped), 0)}
											</td>
											<td></td>
										</tr>
									{/each}
								{/if}
							{/each}
						{/if}
					{/if}
				{/each}
			</tbody>
		</table>
	</div>
</div>

<style>
	.dropped-items {
		background-color: rgba(21, 255, 0, 0.1);
	}

	.destroyed-items {
		background-color: rgba(255, 0, 0, 0.117);
	}
	.cursor-pointer {
		cursor: pointer;
	}
</style>
