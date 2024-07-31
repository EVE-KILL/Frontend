<script lang="ts">
	import { getUpstreamUrl } from '$lib/Config';
	import type { Killmail } from '../../../types/Killmail.ts';
	import type { Fitting } from '../../../types/Killmail/Fitting.ts';
	import { formatNumber } from '$lib/Helpers.ts';
	import { generateEveShipFit, itemSlotTypes } from '$lib/Killmail.ts';
	import {
		ShipFit,
		CurrentCharacterProvider,
		DefaultCharactersProvider,
		EveDataProvider,
		DogmaEngineProvider,
		CurrentFitProvider,
		StatisticsProvider,
		useImportEveShipFit
	} from '@eveshipfit/react';
	import { onMount } from 'svelte';

	export let data;
	let killmail: Killmail;
	let fit: Fitting;
	let totalDamage: number;
	const upstreamUrl = getUpstreamUrl();

	let groupedItems = [];

	onMount(async () => {
		const response = await fetch(`${upstreamUrl}/api/killmail/${data.id}`);
		killmail = await response.json();
		console.log(killmail);

		// Generate the ESF for the killmail
		fit = await generateEveShipFit(killmail);

		// Group items by slot type
		const slotTypes = itemSlotTypes();
		groupedItems = Object.keys(slotTypes).map((slotType) => {
			return {
				slotType,
				items: killmail.items.filter((item) => slotTypes[slotType].includes(item.flag))
			};
		});

		totalDamage = calculateTotalDamage(killmail.attackers);
	});

	function itemDroppedIsk(items) {
		let total = 0;
		items.forEach((item) => {
			if (item.qty_dropped > 0) {
				total += item.value * item.qty_dropped;
			}
		});
		return total;
	}

	function itemDestroyedIsk(items) {
		let total = 0;
		items.forEach((item) => {
			if (item.qty_destroyed > 0) {
				total += item.value * item.qty_destroyed;
			}
		});
		return total;
	}

	function calculateTotalDamage(attackers) {
		return attackers.reduce((total, attacker) => total + attacker.damage_done, 0);
	}

	// Function to get gradient color based on security status
	function getSecurityColor(status) {
		// Convert the range from -1 to 1 to 0 to 1
		const normalizedStatus = (status + 1) / 2;
		// Calculate the red and green values
		const red = Math.round(255 * (1 - normalizedStatus));
		const green = Math.round(255 * normalizedStatus);
		return `rgb(${red}, ${green}, 0)`;
	}
</script>

{#if killmail && fit}
	<div class="container flex p-2 pt-4 gap-2">
		<!-- Left Container -->
		<div class="w-full text-white p-4 rounded-lg shadow-lg">
			<div class="flex">
				<!-- Fitting Wheel -->
				<div class="fitting-wheel mr-4">
					<react:CurrentFitProvider initialFit={fit}>
						<react:EveDataProvider dataUrl="https://eve-kill.com/sde/">
							<react:DogmaEngineProvider>
								<react:DefaultCharactersProvider>
									<react:CurrentCharacterProvider>
										<react:StatisticsProvider>
											<react:ShipFit withStats />
										</react:StatisticsProvider>
									</react:CurrentCharacterProvider>
								</react:DefaultCharactersProvider>
							</react:DogmaEngineProvider>
						</react:EveDataProvider>
					</react:CurrentFitProvider>
				</div>

				<!-- Kill Information -->
				<div>
					<div class="w-full flex flex-col items-start mb-4">
						<div class="flex justify-start items-start mb-2">
							<!-- Character and Corporation Info -->
							<a href={`/character/${killmail.victim.character_id}/`} class="mr-2">
								<img
									src={`https://images.evetech.net/characters/${killmail.victim.character_id}/portrait?size=128`}
									alt={killmail.victim.character_name}
									class="h-32 w-32 rounded-md"
								/>
							</a>
							<div class="flex flex-col justify-center">
								<a href={`/corporation/${killmail.victim.corporation_id}/`}>
									<img
										src={`https://images.evetech.net/corporations/${killmail.victim.corporation_id}/logo?size=64`}
										alt={killmail.victim.corporation_name}
										class="h-16 w-16 rounded-md"
									/>
								</a>
								{#if killmail.victim.alliance_id > 0}
									<a href={`/alliance/${killmail.victim.alliance_id}/`}>
										<img
											src={`https://images.evetech.net/alliances/${killmail.victim.alliance_id}/logo?size=64`}
											alt={killmail.victim.alliance_name}
											class="h-16 w-16 rounded-md"
										/>
									</a>
								{/if}
								{#if killmail.victim.faction_id > 0}
									<a href={`/faction/${killmail.victim.faction_id}/`}>
										<img
											src={`https://images.evetech.net/corporations/${killmail.victim.faction_id}/logo?size=64`}
											alt={killmail.victim.faction_name}
											class="h-16 w-16 rounded-md"
										/>
									</a>
								{/if}
							</div>
						</div>
					</div>
					<table class="table-auto w-full text-left mt-4 text-sm">
						<tbody>
							<tr>
								<th class="p-1">Character:</th>
								<td class="p-1">
									<a href={`/character/${killmail.victim.character_id}/`} class="text-lg font-bold">
										{killmail.victim.character_name}
									</a>
								</td>
							</tr>
							<tr>
								<th class="p-1">Corporation:</th>
								<td class="p-1">
									<a href={`/corporation/${killmail.victim.corporation_id}/`} class="text-sm">
										{killmail.victim.corporation_name}
									</a>
								</td>
							</tr>
							{#if killmail.victim.alliance_id > 0}
								<tr>
									<th class="p-1">Alliance:</th>
									<td class="p-1">
										<a href={`/alliance/${killmail.victim.alliance_id}/`} class="text-sm">
											{killmail.victim.alliance_name}
										</a>
									</td>
								</tr>
							{/if}
							{#if killmail.victim.faction_id > 0}
								<tr>
									<th class="p-1">Faction:</th>
									<td class="p-1">
										<a href={`/faction/${killmail.victim.faction_id}/`} class="text-sm">
											{killmail.victim.faction_name}
										</a>
									</td>
								</tr>
							{/if}
							<tr>
								<th class="p-1">Ship:</th>
								<td class="p-1">
									<a href={`/ship/${killmail.victim.ship_id}/`} class="text-blue-500">
										{killmail.victim.ship_name}
									</a>
									<small class="text-gray-500">
										(
										<a href={`/group/${killmail.victim.ship_group_id}/`} class="text-blue-500">
											{killmail.victim.ship_group_name}
										</a>
										)
									</small>
								</td>
							</tr>
							<tr>
								<th class="p-1">System:</th>
								<td class="p-1">
									<a href={`/system/${killmail.system_id}/`} class="text-blue-500">
										{killmail.system_name}
									</a>
									<span class="text-gray-500">
										(<span style={`color: ${getSecurityColor(killmail.system_security)}`}>
											{formatNumber(killmail.system_security)}
										</span>)
									</span>
								</td>
							</tr>
							<tr>
								<th class="p-1">Region:</th>
								<td class="p-1">
									<a href={`/region/${killmail.region_id}/`} class="text-blue-500">
										{killmail.region_name}
									</a>
								</td>
							</tr>
							{#if killmail.near != ''}
								<tr>
									<th class="p-1">Location:</th>
									<td class="p-1">{killmail.near}</td>
								</tr>
							{/if}
							<tr>
								<th class="p-1">Time:</th>
								<td class="p-1">{killmail.kill_time}</td>
							</tr>
							<tr>
								<th class="p-1">Points:</th>
								<td class="p-1">{killmail.point_value}</td>
							</tr>
							<tr>
								<th class="p-1">Damage:</th>
								<td class="p-1">{formatNumber(killmail.victim.damage_taken)}</td>
							</tr>
							<tr>
								<th class="p-1">Dropped:</th>
								<td class="p-1 font-bold">{formatNumber(itemDroppedIsk(killmail.items))} ISK</td>
							</tr>
							<tr>
								<th class="p-1">Destroyed:</th>
								<td class="p-1 font-bold">{formatNumber(itemDestroyedIsk(killmail.items))} ISK</td>
							</tr>
							<tr>
								<th class="p-1">Total:</th>
								<td class="p-1 font-bold">{formatNumber(killmail.total_value)} ISK</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>

			<!-- Items -->
			<div class="w-full rounded-lg shadow-lg custom-space-x mt-4">
				<div class="overflow-x-auto" role="table">
					<table class="table-auto min-w-full bg-semi-transparent bg-gray-800 rounded-lg shadow-lg">
						<thead>
							<tr class="bg-darker text-white uppercase text-xs leading-normal">
								<th class="px-2 py-1" scope="col"></th>
								<th class="px-2 py-1" scope="col">Name</th>
								<th class="px-2 py-1" scope="col">Destroyed</th>
								<th class="px-2 py-1" scope="col">Dropped</th>
								<th class="px-2 py-1" scope="col">Value (ISK)</th>
							</tr>
						</thead>
						<tbody class="text-gray-300 text-sm">
							{#each groupedItems as group}
								{#if group.items.length > 0}
									<tr class="bg-gray-700 text-white">
										<td colspan="5" class="px-2 py-1 font-bold">{group.slotType}</td>
									</tr>
								{/if}
								{#each group.items as item}
									<tr
										class="border-b border-gray-700 hover:bg-gray-600 transition-colors duration-300"
									>
										<td class="px-2 py-1">
											<img
												src={`https://images.evetech.net/types/${item.type_id}/icon?size=32`}
												alt={item.type_name}
												class="h-8 w-8 rounded-md"
											/>
										</td>
										<td class="px-2 py-1">{item.type_name}</td>
										<td class="px-2 py-1">{item.qty_destroyed}</td>
										<td class="px-2 py-1">{item.qty_dropped}</td>
										<td class="px-2 py-1">
											{formatNumber(item.value * (item.qty_destroyed + item.qty_dropped))}
										</td>
									</tr>
								{/each}
							{/each}
						</tbody>
					</table>
				</div>
			</div>
		</div>

		<!-- Right Container -->
		<div class="w-2/4 text-white p-4 rounded-lg shadow-lg">
			<div class="overflow-x-auto" role="table">
				<table class="table-auto bg-semi-transparent bg-gray-800 rounded-lg shadow-lg">
					<thead>
						<tr class="bg-darker text-white uppercase text-xs leading-normal">
							<th class="px-2 py-1" scope="col"></th>
							<th class="px-2 py-1" scope="col"></th>
							<th class="px-2 py-1" scope="col"></th>
							<th class="px-2 py-1" scope="col">Damage</th>
						</tr>
					</thead>
					<tbody class="text-gray-300 text-sm">
						{#each killmail.attackers as attacker}
							<tr class="border-b border-gray-700 hover:bg-gray-600 transition-colors duration-300">
								<td class="px-2 py-1">
									<a href={`/character/${attacker.character_id}`}>
										<img
											src={`${attacker.character_image_url}?size=128`}
											alt={attacker.character_name}
											class="h-16 w-16 rounded-md"
										/>
									</a>
								</td>
								<td class="px-2 py-1">
									<img
										src={attacker.ship_image_url}
										alt={attacker.ship_name}
										class="h-8 w-8 rounded-md"
									/>
									<img
										src={`https://images.evetech.net/types/${attacker.weapon_type_id}/icon?size=64`}
										alt={attacker.weapon_type_name}
										class="h-8 w-8 rounded-md"
									/>
								</td>
								<td class="px-2 py-1">
									<div>
										<a
											href={`/character/${attacker.character_id}`}
											class="text-blue-400 hover:underline"
										>
											{attacker.character_name}
										</a>
									</div>
									<div>
										<a
											href={`/corporation/${attacker.corporation_id}`}
											class="text-blue-400 hover:underline"
										>
											{attacker.corporation_name}
										</a>
									</div>
									<div>
										<a
											href={`/alliance/${attacker.alliance_id}`}
											class="text-blue-400 hover:underline"
										>
											{attacker.alliance_name}
										</a>
									</div>
								</td>
								<td class="px-2 py-1">
									<div>{attacker.damage_done}</div>
									<div>{((attacker.damage_done / totalDamage) * 100).toFixed(1)}%</div>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</div>
{/if}

<style>
	.fitting-wheel {
		position: relative;
		top: 0;
		right: 0;
		width: 600px;
		height: 600px;
		min-width: 600px;
		min-height: 600px;
	}

	.custom-space-x {
		margin-right: 25px;
	}
</style>
