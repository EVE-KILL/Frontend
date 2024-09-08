<script lang="ts">
	import type Killmail from '../../../types/Killmail.ts';

	import { getUpstreamUrl } from '$lib/Config';
	import { onMount } from 'svelte';
	import { formatNumber, convertIskToBillions } from '$lib/Helpers.ts';

	export let data;
	const upstreamUrl = getUpstreamUrl();

	let killmail_id = data.id;
	let battle;
	let blueTeamKills: Killmail[] = [];
	let redTeamKills: Killmail[] = [];
	let blueTeamStats = { iskLost: 0, shipsLost: 0, damageInflicted: 0 };
	let redTeamStats = { iskLost: 0, shipsLost: 0, damageInflicted: 0 };
	let killmails: Killmail[] = [];
	let system;

	onMount(async () => {
		let battleUrl = `${upstreamUrl}/api/battles/killmail/${killmail_id}`;
		const response = await fetch(battleUrl);
		battle = await response.json();
		console.log(battle);

		// Fetch the killmails
		killmails = await fetchKillmails(battle.start_time, battle.end_time, [
			battle.system_id,
			30000163
		]);

		// Split the killmails into blue and red team
		splitKillmailsToSides(killmails, battle);
	});

	async function fetchKillmails(startTime: number, endTime: number, systemIds: number[]) {
		let query = `${upstreamUrl}/api/query/between/${startTime}/${endTime}/`;
		query += systemIds.map((id) => `system_id/${id}`).join('/');

		const response = await fetch(query);
		return await response.json();
	}

	function truncateString(str: string, num: number) {
		return str.length <= num ? str : str.slice(0, num) + '...';
	}

	function convertUnixTimeToDateTime(unixTime: number) {
		let date = new Date(unixTime * 1000);
		return date.toLocaleString();
	}

	function duration(start: number, end: number) {
		let duration = end - start;
		let minutes = Math.floor(duration / 60);
		let seconds = duration % 60;
		return `${minutes}m ${seconds}s`;
	}

	function generateTotalValue(killmails: Killmail[]) {
		return killmails.reduce((acc, killmail) => acc + killmail.total_value, 0);
	}

	function countOfPilotsInvolved(killmails: Killmail[]) {
		// Count the amount of unique attackers[].character_id there are on all the killmails
		let characterIds: number[] = [];
		killmails.forEach((killmail) => {
			killmail.attackers.forEach((attacker) => {
				if (!characterIds.includes(attacker.character_id)) {
					characterIds.push(attacker.character_id);
				}
			});
		});

		return characterIds.length;
	}

	function countOfCorporationsInvolved(killmails: Killmail[]) {
		// Count the amount of unique attackers[].corporation_id there are on all the killmails
		let corporationIds: number[] = [];
		killmails.forEach((killmail) => {
			killmail.attackers.forEach((attacker) => {
				if (!corporationIds.includes(attacker.corporation_id)) {
					corporationIds.push(attacker.corporation_id);
				}
			});
		});

		return corporationIds.length;
	}

	function countOfAlliancesInvolved(killmails: Killmail[]) {
		// Count the amount of unique attackers[].alliance_id there are on all the killmails
		let allianceIds: number[] = [];
		killmails.forEach((killmail) => {
			killmail.attackers.forEach((attacker) => {
				if (!allianceIds.includes(attacker.alliance_id)) {
					allianceIds.push(attacker.alliance_id);
				}
			});
		});

		return allianceIds.length;
	}

	function splitKillmailsToSides(killmails: Killmail[], battle) {
		// Create sets for quick lookup of alliance and corporation IDs
		let blueAlliances = new Set(battle.blue_team.alliances.map((a) => a.id));
		let blueCorporations = new Set(battle.blue_team.corporations.map((c) => c.id));
		let redAlliances = new Set(battle.red_team.alliances.map((a) => a.id));
		let redCorporations = new Set(battle.red_team.corporations.map((c) => c.id));

		// Reset the blue and red team arrays and stats
		blueTeamKills = [];
		redTeamKills = [];
		blueTeamStats = { iskLost: 0, shipsLost: 0, damageInflicted: 0 };
		redTeamStats = { iskLost: 0, shipsLost: 0, damageInflicted: 0 };

		killmails.forEach((killmail) => {
			let isBlueTeam = false;
			let isRedTeam = false;

			// Check the victim first
			if (killmail.victim.alliance_id && blueAlliances.has(killmail.victim.alliance_id)) {
				isBlueTeam = true;
			} else if (
				killmail.victim.alliance_id &&
				redAlliances.has(killmail.victim.alliance_id)
			) {
				isRedTeam = true;
			} else if (
				killmail.victim.corporation_id &&
				blueCorporations.has(killmail.victim.corporation_id)
			) {
				isBlueTeam = true;
			} else if (
				killmail.victim.corporation_id &&
				redCorporations.has(killmail.victim.corporation_id)
			) {
				isRedTeam = true;
			}

			// If no team determined by victim, check the attackers
			if (!isBlueTeam && !isRedTeam) {
				killmail.attackers.forEach((attacker) => {
					if (attacker.alliance_id && blueAlliances.has(attacker.alliance_id)) {
						isBlueTeam = true;
					} else if (attacker.alliance_id && redAlliances.has(attacker.alliance_id)) {
						isRedTeam = true;
					} else if (
						attacker.corporation_id &&
						blueCorporations.has(attacker.corporation_id)
					) {
						isBlueTeam = true;
					} else if (
						attacker.corporation_id &&
						redCorporations.has(attacker.corporation_id)
					) {
						isRedTeam = true;
					}
				});
			}

			// Add the killmail to the respective team's list and update stats
			if (isBlueTeam) {
				blueTeamKills.push(killmail);
				blueTeamStats.iskLost += killmail.total_value;
				blueTeamStats.shipsLost += 1;
				blueTeamStats.damageInflicted += killmail.victim.damage_taken;
			} else if (isRedTeam) {
				redTeamKills.push(killmail);
				redTeamStats.iskLost += killmail.total_value;
				redTeamStats.shipsLost += 1;
				redTeamStats.damageInflicted += killmail.victim.damage_taken;
			}
		});

		// Sort the killmails by total_value
		blueTeamKills = blueTeamKills.sort((a, b) => b.total_value - a.total_value);
		redTeamKills = redTeamKills.sort((a, b) => b.total_value - a.total_value);
	}
</script>

<div class="p-4 bg-gray-900 rounded-lg shadow-lg text-white">
	{#if battle}
		<!-- Top Div -->
		<div class="mb-4">
			<div class="text-lg font-bold">
				Battle in System: {battle.systemInfo.name} ({formatNumber(
					battle.systemInfo.security_status
				)}) - {battle.systemInfo.region_name}
			</div>
			<div class="text-sm text-gray-400">
				Start Time: {convertUnixTimeToDateTime(battle.start_time)} | End Time: {convertUnixTimeToDateTime(
					battle.end_time
				)}
			</div>
			<div class="text-sm text-gray-400">
				ISK Lost: {convertIskToBillions(generateTotalValue(killmails))} ISK | Pilots Involved:
				{countOfPilotsInvolved(killmails)} | Corporations:
				{countOfCorporationsInvolved(killmails)} | Alliances: {countOfAlliancesInvolved(
					killmails
				)}
			</div>
			<div class="text-sm text-gray-400">
				Duration: {duration(battle.start_time, battle.end_time)}
			</div>
		</div>

		<!-- Teams Table -->
		<div class="grid grid-cols-2 gap-4">
			<div>
				<div class="mb-2 text-lg font-bold">Blue Team</div>
				<div class="bg-gray-800 p-2 rounded-lg shadow-lg">
					<div class="mb-2 text-lg font-bold">Blue Team</div>
					<div class="mb-2 text-sm text-gray-400">
						ISK Lost: {convertIskToBillions(blueTeamStats.iskLost)} ISK | Ships Lost: {blueTeamStats.shipsLost}
						| Damage Inflicted: {blueTeamStats.damageInflicted}
					</div>
					<div class="mb-2 text-sm text-gray-400">Alliances:</div>
					<ul class="list-disc list-inside">
						{#each battle.blue_team.alliances as alliance}
							<li>{alliance.name}</li>
						{/each}
					</ul>
				</div>
			</div>
			<div>
				<div class="mb-2 text-lg font-bold">Red Team</div>
				<div class="bg-gray-800 p-2 rounded-lg shadow-lg">
					<div class="mb-2 text-lg font-bold">Red Team</div>
					<div class="mb-2 text-sm text-gray-400">
						ISK Lost: {convertIskToBillions(redTeamStats.iskLost)} ISK | Ships Lost: {redTeamStats.shipsLost}
						| Damage Inflicted: {redTeamStats.damageInflicted}
					</div>
					<div class="mb-2 text-sm text-gray-400">Alliances:</div>
					<ul class="list-disc list-inside">
						{#each battle.red_team.alliances as alliance}
							<li>{alliance.name}</li>
						{/each}
					</ul>
				</div>
			</div>
		</div>

		<!-- Kills List -->
		<div class="mt-4 grid grid-cols-2 gap-4">
			<!-- Blue Team Kills -->
			<div>
				<div class="mb-2 text-lg font-bold">Blue Team Losses</div>
				<div class="overflow-x-auto" role="table">
					<table
						class="table-auto min-w-full bg-semi-transparent bg-gray-800 rounded-lg shadow-lg"
					>
						<thead>
							<tr class="bg-darker text-white uppercase text-xs leading-normal">
								<th class="px-2 py-1 w-[64px]" scope="col"></th>
								<th class="px-2 py-1" scope="col">Ship</th>
								<th class="px-2 py-1 w-[64px]" scope="col"></th>
								<th class="px-2 py-1" scope="col">Victim</th>
								<th class="px-2 py-1" scope="col">Final Blow</th>
							</tr>
						</thead>
						<tbody class="text-gray-300 text-sm">
							{#each blueTeamKills as kill}
								<tr
									class="border-b border-gray-700 hover:bg-gray-600 transition-colors duration-300"
									on:click={() => {
										window.location.href = `/kill/${kill.killmail_id}`;
									}}
								>
									<td class="px-2 py-1">
										<img
											src="{kill.victim.ship_image_url}?size=64"
											alt="Ship: {kill.victim.ship_name}"
											class="w-10 rounded"
										/>
									</td>
									<td class="px-2 py-1">
										{truncateString(kill.victim.ship_name, 20)}<br />
										{#if kill.total_value > 50}
											<span class="text-gray-400"
												>{formatNumber(kill.total_value)} ISK</span
											>
										{/if}
									</td>
									<td class="px-2 py-1">
										<img
											src="{kill.victim.character_image_url}?size=64"
											alt="Character: {kill.victim.character_name}"
											class="w-10 rounded"
										/>
									</td>
									<td class="px-2 py-1">
										{kill.victim.character_name}<br />
										<span class="text-gray-400"
											>{truncateString(
												kill.victim.corporation_name,
												22
											)}</span
										>
									</td>
									<td class="px-2 py-1">
										{#if Array.isArray(kill.attackers)}
											{#each kill.attackers as attacker}
												{#if attacker.final_blow}
													{#if kill.is_npc}
														{attacker.faction_name}<br />
														<span class="text-gray-400"
															>{truncateString(
																attacker.ship_group_name,
																22
															)}</span
														>
													{:else}
														{attacker.character_name}<br />
														<span class="text-gray-400"
															>{truncateString(
																attacker.corporation_name,
																22
															)}</span
														>
													{/if}
												{/if}
											{/each}
										{/if}
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>

			<!-- Red Team Kills -->
			<div>
				<div class="mb-2 text-lg font-bold">Red Team Losses</div>
				<div class="overflow-x-auto" role="table">
					<table
						class="table-auto min-w-full bg-semi-transparent bg-gray-800 rounded-lg shadow-lg"
					>
						<thead>
							<tr class="bg-darker text-white uppercase text-xs leading-normal">
								<th class="px-2 py-1 w-[64px]" scope="col"></th>
								<th class="px-2 py-1" scope="col">Ship</th>
								<th class="px-2 py-1 w-[64px]" scope="col"></th>
								<th class="px-2 py-1" scope="col">Victim</th>
								<th class="px-2 py-1" scope="col">Final Blow</th>
							</tr>
						</thead>
						<tbody class="text-gray-300 text-sm">
							{#each redTeamKills as kill}
								<tr
									class="border-b border-gray-700 hover:bg-gray-600 transition-colors duration-300"
									on:click={() => {
										window.location.href = `/kill/${kill.killmail_id}`;
									}}
								>
									<td class="px-2 py-1">
										<img
											src="{kill.victim.ship_image_url}?size=64"
											alt="Ship: {kill.victim.ship_name}"
											class="w-10 rounded"
										/>
									</td>
									<td class="px-2 py-1">
										{truncateString(kill.victim.ship_name, 20)}<br />
										{#if kill.total_value > 50}
											<span class="text-gray-400"
												>{formatNumber(kill.total_value)} ISK</span
											>
										{/if}
									</td>
									<td class="px-2 py-1">
										<img
											src="{kill.victim.character_image_url}?size=64"
											alt="Character: {kill.victim.character_name}"
											class="w-10 rounded"
										/>
									</td>
									<td class="px-2 py-1">
										{kill.victim.character_name}<br />
										<span class="text-gray-400"
											>{truncateString(
												kill.victim.corporation_name,
												22
											)}</span
										>
									</td>
									<td class="px-2 py-1">
										{#if Array.isArray(kill.attackers)}
											{#each kill.attackers as attacker}
												{#if attacker.final_blow}
													{#if kill.is_npc}
														{attacker.faction_name}<br />
														<span class="text-gray-400"
															>{truncateString(
																attacker.ship_group_name,
																22
															)}</span
														>
													{:else}
														{attacker.character_name}<br />
														<span class="text-gray-400"
															>{truncateString(
																attacker.corporation_name,
																22
															)}</span
														>
													{/if}
												{/if}
											{/each}
										{/if}
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	{:else}
		<div>Loading...</div>
	{/if}
</div>
