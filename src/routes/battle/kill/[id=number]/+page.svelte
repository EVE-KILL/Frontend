<script lang="ts">
	import type Killmail from '$lib/types/Killmail.ts';

	import { getUpstreamUrl } from '$lib/Config';
	import { onMount } from 'svelte';
	import { formatNumber, convertIskToBillions } from '$lib/Helpers.ts';
	import Alliances from './alliances.svelte';
	import Corporations from './corporations.svelte';
	import Characters from './characters.svelte';
	import Kills from './kills.svelte';
	import Teams from './teams.svelte';
	import Timeline from './timeline.svelte';

	export let data;
	const upstreamUrl = getUpstreamUrl();

	let killmail_id = data.id;
	let battle;
	let blueTeamKills: Killmail[] = [];
	let redTeamKills: Killmail[] = [];
	let blueTeamStats = { iskLost: 0, shipsLost: 0, damageInflicted: 0 };
	let redTeamStats = { iskLost: 0, shipsLost: 0, damageInflicted: 0 };
	let blueTeamAlliances = [];
	let redTeamAlliances = [];
	let blueTeamCorporations = [];
	let redTeamCorporations = [];
	let blueTeamCharacters = [];
	let redTeamCharacters = [];
	let killmails: Killmail[] = [];
	let activeTab = 'kills'; // Track the active tab

	onMount(async () => {
		let battleUrl = `${upstreamUrl}/api/battles/killmail/${killmail_id}`;
		const response = await fetch(battleUrl);
		battle = await response.json();

		// Fetch the killmails
		killmails = await fetchKillmails(battle.start_time, battle.end_time, [battle.system_id]);

		// Split the killmails into blue and red team
		splitKillmailsToSides(killmails, battle);
	});

	async function fetchKillmails(startTime: number, endTime: number, systemIds: number[]) {
		let queryUrl = `${upstreamUrl}/api/query`;
		let queryJson = JSON.stringify({
			type: 'complex',
			filter: {
				kill_time: {
					'$gte': startTime,
					'$lte': endTime
				},
				system_id: {
					'$in': systemIds
				}
			},
			options: {
				limit: 1000
			}
		});

		// POST queryJson to queryUrl
		const response = await fetch(queryUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: queryJson
		});
		let result = await response.json();
		return result.killmails;
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

	function splitKillmailsToSides(killmails: Killmail[], battle) {
		// Create maps to track alliances, corporations, and characters with counts and total kill values
		let blueAlliancesMap = new Map();
		let blueCorporationsMap = new Map();
		let blueCharactersMap = new Map();
		let redAlliancesMap = new Map();
		let redCorporationsMap = new Map();
		let redCharactersMap = new Map();

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
			let isBlueVictim = false;
			let isRedVictim = false;

			// Determine the victim's team
			if (killmail.victim.alliance_id && blueAlliances.has(killmail.victim.alliance_id)) {
				isBlueVictim = true;
			} else if (killmail.victim.alliance_id && redAlliances.has(killmail.victim.alliance_id)) {
				isRedVictim = true;
			} else if (killmail.victim.corporation_id && blueCorporations.has(killmail.victim.corporation_id)) {
				isBlueVictim = true;
			} else if (killmail.victim.corporation_id && redCorporations.has(killmail.victim.corporation_id)) {
				isRedVictim = true;
			}

			// Track stats for the victim's team
			if (isBlueVictim) {
				redTeamKills.push(killmail); // Red team killed blue team
				blueTeamStats.iskLost += killmail.total_value;
				blueTeamStats.shipsLost += 1;
				blueTeamStats.damageInflicted += killmail.victim.damage_taken;

				// Track the victim's alliance, corporation, and character
				trackKillStats(blueAlliancesMap, killmail.victim.alliance_id, killmail.victim.alliance_name, killmail.total_value);
				trackKillStats(
					blueCorporationsMap,
					killmail.victim.corporation_id,
					killmail.victim.corporation_name,
					killmail.total_value,
					killmail.victim.alliance_id,
					killmail.victim.alliance_name
				);
				trackKillStats(blueCharactersMap, killmail.victim.character_id, killmail.victim.character_name, killmail.total_value);
			} else if (isRedVictim) {
				blueTeamKills.push(killmail); // Blue team killed red team
				redTeamStats.iskLost += killmail.total_value;
				redTeamStats.shipsLost += 1;
				redTeamStats.damageInflicted += killmail.victim.damage_taken;

				// Track the victim's alliance, corporation, and character
				trackKillStats(redAlliancesMap, killmail.victim.alliance_id, killmail.victim.alliance_name, killmail.total_value);
				trackKillStats(
					redCorporationsMap,
					killmail.victim.corporation_id,
					killmail.victim.corporation_name,
					killmail.total_value,
					killmail.victim.alliance_id,
					killmail.victim.alliance_name
				);
				trackKillStats(redCharactersMap, killmail.victim.character_id, killmail.victim.character_name, killmail.total_value);
			}

			// Now, track which team did the killing (attackers)
			killmail.attackers.forEach((attacker) => {
				if (attacker.alliance_id && blueAlliances.has(attacker.alliance_id)) {
					// Blue team attacker
					trackKillStats(blueAlliancesMap, attacker.alliance_id, attacker.alliance_name, killmail.total_value);
					trackKillStats(
						blueCorporationsMap,
						attacker.corporation_id,
						attacker.corporation_name,
						killmail.total_value,
						attacker.alliance_id,
						attacker.alliance_name
					);
					trackKillStats(blueCharactersMap, attacker.character_id, attacker.character_name, killmail.total_value);
				} else if (attacker.alliance_id && redAlliances.has(attacker.alliance_id)) {
					// Red team attacker
					trackKillStats(redAlliancesMap, attacker.alliance_id, attacker.alliance_name, killmail.total_value);
					trackKillStats(
						redCorporationsMap,
						attacker.corporation_id,
						attacker.corporation_name,
						killmail.total_value,
						attacker.alliance_id,
						attacker.alliance_name
					);
					trackKillStats(redCharactersMap, attacker.character_id, attacker.character_name, killmail.total_value);
				}
			});
		});

		// Convert maps to arrays and sort by kills (descending order)
		blueTeamCharacters = Array.from(blueCharactersMap.values()).sort((a, b) => b.kills - a.kills);
		redTeamCharacters = Array.from(redCharactersMap.values()).sort((a, b) => b.kills - a.kills);

		blueTeamAlliances = Array.from(blueAlliancesMap.values()).sort((a, b) => b.kills - a.kills);
		blueTeamCorporations = Array.from(blueCorporationsMap.values()).sort((a, b) => b.kills - a.kills);

		redTeamAlliances = Array.from(redAlliancesMap.values()).sort((a, b) => b.kills - a.kills);
		redTeamCorporations = Array.from(redCorporationsMap.values()).sort((a, b) => b.kills - a.kills);

		// Sort the killmails by total_value
		blueTeamKills = blueTeamKills.sort((a, b) => b.total_value - a.total_value);
		redTeamKills = redTeamKills.sort((a, b) => b.total_value - a.total_value);
	}

	// Helper function to add killmail details to a map
	function trackKillStats(map, id, name, totalValue, allianceId, allianceName) {
		if (!id || !name) return; // If no id or name, do nothing

		if (!map.has(id)) {
			map.set(id, {
				id,
				name,
				alliance_id: allianceId, // Add the alliance_id here
				alliance_name: allianceName, // Store alliance name
				kills: 0,
				totalValue: 0
			});
		}

		let stats = map.get(id);
		stats.kills += 1;
		stats.totalValue += totalValue;
	}
</script>

<div class="p-4 bg-background-900 rounded-lg shadow-lg text-white">
	{#if battle}
		<!-- Top Div -->
		<div class="mb-4">
			<div class="text-lg font-bold">
				Battle in System: {battle.systemInfo.name} ({formatNumber(battle.systemInfo.security_status)}) - {battle.systemInfo.region_name}
			</div>
			<div class="text-sm text-background-400">
				Start Time: {convertUnixTimeToDateTime(battle.start_time)} | End Time: {convertUnixTimeToDateTime(battle.end_time)}
			</div>
			<div class="text-sm text-background-400">
				ISK Lost: {convertIskToBillions(blueTeamStats.iskLost + redTeamStats.iskLost)} ISK | Ships Lost: {blueTeamStats.shipsLost +
					redTeamStats.shipsLost} | Damage Inflicted: {formatNumber(blueTeamStats.damageInflicted + redTeamStats.damageInflicted)}
			</div>
			<div class="text-sm text-background-400">
				Duration: {duration(battle.start_time, battle.end_time)}
			</div>
		</div>

		<!-- Teams Table -->
		<Teams {blueTeamStats} {redTeamStats} {blueTeamAlliances} {redTeamAlliances} {blueTeamCorporations} {redTeamCorporations} />

		<!-- Tabs Navigation -->
		<div class="mb-4">
			<button
				class="p-2 text-sm font-semibold text-white rounded-lg bg-background-700 hover:bg-background-600"
				on:click={() => (activeTab = 'kills')}
				class:active={activeTab === 'kills'}
			>
				Kills
			</button>
			<button
				class="p-2 text-sm font-semibold text-white rounded-lg bg-background-700 hover:bg-background-600 ml-2"
				on:click={() => (activeTab = 'alliances')}
				class:active={activeTab === 'alliances'}
			>
				Alliances
			</button>
			<button
				class="p-2 text-sm font-semibold text-white rounded-lg bg-background-700 hover:bg-background-600 ml-2"
				on:click={() => (activeTab = 'corporations')}
				class:active={activeTab === 'corporations'}
			>
				Corporations
			</button>
			<button
				class="p-2 text-sm font-semibold text-white rounded-lg bg-background-700 hover:bg-background-600 ml-2"
				on:click={() => (activeTab = 'characters')}
				class:active={activeTab === 'characters'}
			>
				Characters
			</button>
			<button
				class="p-2 text-sm font-semibold text-white rounded-lg bg-background-700 hover:bg-background-600 ml-2"
				on:click={() => (activeTab = 'timeline')}
				class:active={activeTab === 'timeline'}
			>
				Timeline
			</button>
		</div>

		<!-- Conditional Tab Content -->
		{#if activeTab === 'kills'}
			<Kills {blueTeamKills} {redTeamKills} />
		{/if}

		{#if activeTab === 'alliances'}
			<Alliances {redTeamAlliances} {blueTeamAlliances} />
		{/if}

		{#if activeTab === 'corporations'}
			<Corporations {blueTeamCorporations} {redTeamCorporations} />
		{/if}

		{#if activeTab === 'characters'}
			<Characters {blueTeamCharacters} {redTeamCharacters} />
		{/if}

		{#if activeTab === 'timeline'}
			<Timeline {killmails} {battle} />
		{/if}
	{:else}
		<div>Loading...</div>
	{/if}
</div>

<style>
	button.active {
		background-color: #4a5568;
	}

	/* Arrow rotation class for collapse/expand */
	.rotate-90 {
		transform: rotate(90deg);
	}
</style>
