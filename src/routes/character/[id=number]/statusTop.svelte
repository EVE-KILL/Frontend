<script lang="ts">
	import type { Character } from '$lib/types/Character.ts';
	import { onMount } from 'svelte';
	import { getUpstreamUrl } from '$lib/Config.ts';
	import { formatNumber, convertIskToMillions, convertIskToBillions } from '$lib/Helpers.ts';

	export let character: Character;
	let stats: any;
	let upstreamUrl = getUpstreamUrl();
	let loading = true;

	onMount(async () => {
		try {
			let response = await fetch(
				`${upstreamUrl}/api/characters/${character.character_id}/shortstats`
			);
			stats = await response.json();
			loading = false;
		} catch (error) {
			console.error('Failed to load stats:', error);
		}
	});
</script>

{#if character}
	<div class="flex items-start bg-semi-transparent p-4">
		<!-- Profile Image with Additional Images -->
		<div class="flex-shrink-0 flex items-center min-w-[256px] min-h-[256px]">
			<img
				src="https://images.evetech.net/characters/{character.character_id}/portrait?size=256"
				alt="Character: {character.name}"
				class="rounded-full"
				style="min-width: 256px; min-height: 256px;"
			/>
			<div class="flex flex-col space-x-2 space-y-2 ml-4">
				<img
					src="https://images.evetech.net/corporations/{character.corporation_id}/logo?size=64"
					alt="Corporation: {character.corporation_name}"
					class="rounded-full"
					style="min-width: 64px; min-height: 64px;"
				/>
				<img
					src="https://images.evetech.net/alliances/{character.alliance_id}/logo?size=64"
					alt="Alliance: {character.alliance_name}"
					class="rounded-full"
					style="min-width: 64px; min-height: 64px;"
				/>
				<img
					src="https://images.evetech.net/corporations/{character.faction_id}/logo?size=64"
					alt="Faction: {character.faction_name}"
					class="rounded-full"
					style="min-width: 64px; min-height: 64px;"
				/>
			</div>
		</div>

		<!-- Profile Information and Stats Tables -->
		<div class="w-full flex justify-between ml-5">
			<!-- Character Info -->
			<div class="flex-grow-0 mr-5">
				<table class="table-auto">
					<tbody>
						<tr>
							<td class="font-bold text-right p-1">Character:</td>
							<td>{character.name}</td>
						</tr>
						<tr>
							<td class="font-bold text-right p-1">Corporation:</td>
							<td>
								<a href="/corporation/{character.corporation_id}">
									{character.corporation_name}
								</a>
							</td>
						</tr>
						{#if character.title}
							<tr>
								<td class="font-bold text-right p-1">Title:</td>
								<td>{character.title}</td>
							</tr>
						{/if}
						{#if character.alliance_id}
							<tr>
								<td class="font-bold text-right p-1">Alliance:</td>
								<td>
									<a href="/alliance/{character.alliance_id}">
										{character.alliance_name}
									</a>
								</td>
							</tr>
						{/if}
						{#if character.faction_id}
							<tr>
								<td class="font-bold text-right p-1">Faction:</td>
								<td>
									<a href="/faction/{character.faction_id}">
										{character.faction_name}
									</a>
								</td>
							</tr>
						{/if}
						<tr>
							<td class="font-bold text-right p-1">Sec. Status:</td>
							<td>{character.security_status.toFixed(3)}</td>
						</tr>
					</tbody>
				</table>
			</div>

			<!-- Stats Tables (Center and Right) -->
			<div class="flex-grow flex justify-between">
				{#if loading}
					<p>Loading stats...</p>
				{:else}
					<!-- Center Table: Kills, ISK Killed, etc. -->
					<table class="table-auto w-1/2 text-right mr-5">
						<tbody>
							<tr>
								<td class="font-bold p-1">Kills:</td>
								<td class="text-left pl-2">{formatNumber(stats.kills, 0)}</td>
							</tr>
							<tr>
								<td class="font-bold p-1">Losses:</td>
								<td class="text-left pl-2">{formatNumber(stats.losses, 0)}</td>
							</tr>
							<tr>
								<td class="font-bold p-1">ISK Killed:</td>
								<td class="text-left pl-2"
									>{convertIskToBillions(stats.iskKilled, 2)}</td
								>
							</tr>
							<tr>
								<td class="font-bold p-1">ISK Lost:</td>
								<td class="text-left pl-2"
									>{convertIskToBillions(stats.iskLost, 2)}</td
								>
							</tr>
							<tr>
								<td class="font-bold p-1">NPC Losses:</td>
								<td class="text-left pl-2">{formatNumber(stats.npcLosses, 0)}</td>
							</tr>
						</tbody>
					</table>

					<!-- Right Table: Solo Kills, Kill Points, etc. -->
					<table class="table-auto w-1/2 text-right">
						<tbody>
							<tr>
								<td class="font-bold p-1">Solo Kills:</td>
								<td class="text-left pl-2">{formatNumber(stats.soloKills, 0)}</td>
							</tr>
							<tr>
								<td class="font-bold p-1">Solo Losses:</td>
								<td class="text-left pl-2">{formatNumber(stats.soloLosses, 0)}</td>
							</tr>
							<tr>
								<td class="font-bold p-1">Kill Points:</td>
								<td class="text-left pl-2">{formatNumber(stats.killPoints, 0)}</td>
							</tr>
							<tr>
								<td class="font-bold p-1">Loss Points:</td>
								<td class="text-left pl-2">{formatNumber(stats.lossPoints, 0)}</td>
							</tr>
							<tr>
								<td class="font-bold p-1">Last Active:</td>
								<td class="text-left pl-2"
									>{new Date(stats.lastActive).toLocaleString()}</td
								>
							</tr>
						</tbody>
					</table>
				{/if}
			</div>
		</div>
	</div>
{/if}

<style>
	.table-auto td {
		padding: 4px 8px;
	}

	/* Center content in the flex container */
	.flex {
		align-items: center;
	}

	/* Align text to left for the values */
	.text-left {
		text-align: left;
	}

	/* Right-align labels */
	.text-right {
		text-align: right;
	}

	/* Ensure the image has a minimum width and height */
	.flex-shrink-0 img {
		min-width: 64px;
		min-height: 64px;
	}
</style>
