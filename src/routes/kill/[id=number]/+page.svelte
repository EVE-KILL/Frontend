<script lang="ts">
	import { getUpstreamUrl } from '$lib/Config';
	import type { Killmail } from '../../../types/Killmail.ts';
	import type { Fitting } from '../../../types/Killmail/Fitting.ts';
	import { formatNumber } from '$lib/Helpers.ts';
	import { generateEveShipFit } from '$lib/Killmail.ts';
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
	const upstreamUrl = getUpstreamUrl();

	onMount(async () => {
		const response = await fetch(`${upstreamUrl}/api/killmail/${data.id}`);
		killmail = await response.json();
		console.log(killmail);

		// Generate the ESF for the killmail
		fit = await generateEveShipFit(killmail);
	});

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
	<div class="container flex flex-col text-white p-4 items-center">
		<div class="w-full flex justify-center items-start mb-4">
			<div class="flex mr-5">
				<!-- Fitting Wheel -->
				<div class="fitting-wheel top-0 right-0 mr-8">
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

				<!-- Kill Details -->
				<div>
					<div class="w-full flex flex-col items-center mb-4">
						<div class="flex justify-center items-start mb-2">
							<!-- Character and Corporation Info -->
							<a href={`/character/${killmail.victim.character_id}/`} class="mr-2">
								<img
									src={`https://images.evetech.net/characters/${killmail.victim.character_id}/portrait?size=128`}
									alt={killmail.victim.character_name}
									class="h-32 w-32 rounded-full"
								/>
							</a>
							<div class="flex flex-col justify-center ml-2">
								<a href={`/corporation/${killmail.victim.corporation_id}/`} class="mb-2">
									<img
										src={`https://images.evetech.net/corporations/${killmail.victim.corporation_id}/logo?size=64`}
										alt={killmail.victim.corporation_name}
										class="h-16 w-16 rounded-md"
									/>
								</a>
								{#if killmail.victim.alliance_id > 0}
									<a href={`/alliance/${killmail.victim.alliance_id}/`} class="mb-2">
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
						<div class="text-center">
							<a href={`/character/${killmail.victim.character_id}/`} class="text-lg font-bold">
								{killmail.victim.character_name}
							</a>
							<br />
							<a href={`/corporation/${killmail.victim.corporation_id}/`} class="text-sm">
								{killmail.victim.corporation_name}
							</a>
							<br />
							{#if killmail.victim.alliance_id > 0}
								<a href={`/alliance/${killmail.victim.alliance_id}/`} class="text-sm">
									{killmail.victim.alliance_name}
								</a>
								<br />
							{/if}
							{#if killmail.victim.faction_id > 0}
								<a href={`/faction/${killmail.victim.faction_id}/`} class="text-sm">
									{killmail.victim.faction_name}
								</a>
							{/if}
						</div>
					</div>
					<table class="table-auto w-full text-left mt-4">
						<tbody>
							<tr>
								<th class="p-2">Ship:</th>
								<td class="p-2">
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
								<th class="p-2">System:</th>
								<td class="p-2">
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
								<th class="p-2">Region:</th>
								<td class="p-2">
									<a href={`/region/${killmail.region_id}/`} class="text-blue-500">
										{killmail.region_name}
									</a>
								</td>
							</tr>
							<tr>
								<th class="p-2">Location:</th>
								<td class="p-2">{killmail.near}</td>
							</tr>
							<tr>
								<th class="p-2">Time:</th>
								<td class="p-2">{killmail.kill_time_str}</td>
							</tr>
							<tr>
								<th class="p-2">Points:</th>
								<td class="p-2">{killmail.point_value}</td>
							</tr>
							<tr>
								<th class="p-2">Damage:</th>
								<td class="p-2">{formatNumber(killmail.victim.damage_taken)}</td>
							</tr>
							<tr>
								<th class="p-2">Total:</th>
								<td class="p-2 font-bold">{formatNumber(killmail.total_value)} ISK</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</div>
	<div class="container flex text-white p-4 justify-between">
		<div class="w-full flex rounded-lg shadow-lg">left</div>
		<div class="w-2/4 flex rounded-lg shadow-lg">right</div>
	</div>
{/if}

<style>
	.fitting-wheel {
		position: relative;
		top: 0;
		right: 0;
		width: 600px;
		height: 600px;
		min-width: 500px;
		min-height: 500px;
	}
</style>
