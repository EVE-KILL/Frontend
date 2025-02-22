<script lang="ts">
	import type { Character } from '$lib/types/Character.ts';
	import { onMount } from 'svelte';
	import { getUpstreamUrl } from '$lib/Config.ts';
	import { formatNumber, convertIskToMillions, convertIskToBillions } from '$lib/Helpers.ts';
	import { useColors } from '$lib/models/useColors';
	import { backendFetch } from '$lib/backendFetcher';

	export let character: Character;
	let stats: any;
	let upstreamUrl = getUpstreamUrl();
	let loading = true;
	let { characterSecurityColor } = useColors();

	onMount(async () => {
		try {
			let response = await backendFetch(`${upstreamUrl}/api/characters/${character.character_id}/shortstats`);
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
				src="https://images.eve-kill.com/characters/{character.character_id}/portrait?size=256"
				alt="Character: {character.name}"
				class="rounded-full"
				style="min-width: 256px; min-height: 256px;"
			/>
			<div class="flex flex-col space-x-2 space-y-2 ml-4">
				<a href="/corporation/{character.corporation_id}">
				<img
					src="https://images.eve-kill.com/corporations/{character.corporation_id}/logo?size=64"
					alt="Corporation: {character.corporation_name}"
					class="rounded-full"
					style="min-width: 64px; min-height: 64px;"
				/>
				</a>
				{#if character.alliance_id}
					<a href="/alliance/{character.alliance_id}">
						<img
							src="https://images.eve-kill.com/alliances/{character.alliance_id}/logo?size=64"
							alt="Alliance: {character.alliance_name}"
							class="rounded-full"
							style="min-width: 64px; min-height: 64px;"
						/>
					</a>
				{/if}
				{#if character.faction_id}
					<a href="/corporation/{character.faction_id}">
						<img
							src="https://images.eve-kill.com/corporations/{character.faction_id}/logo?size=64"
							alt="Faction: {character.faction_name}"
							class="rounded-full"
							style="min-width: 64px; min-height: 64px;"
						/>
					</a>
				{/if}
			</div>
		</div>

		<!-- Profile Information and Stats Tables -->
		<div class="w-full flex justify-between ml-5">
			<!-- Character Info -->
			<div>
				<h1 class="text-2xl font-bold">{character.name}</h1>
				<a href="/corporation/{character.corporation_id}" class="hover:underline">
					<p class="text-background-400">{character.corporation_name}</p>
				</a>
				{#if character.title}
					<p class="text-background-400">{character.title}</p>
				{/if}
				{#if character.alliance_id}
					<a href="/alliance/{character.alliance_id}" class="hover:underline">
						<p class="text-background-400">{character.alliance_name}</p>
					</a>
				{/if}
				{#if character.faction_id}
					<a href="/corporation/{character.faction_id}" class="hover:underline">
						<p class="text-background-400">{character.faction_name}</p>
					</a>
				{/if}
				<p class="text-background-400">Sec. Status: <span style="color: {characterSecurityColor(character.security_status)}">{character.security_status.toFixed(3)}</span></p>
				{#if !loading}
					<p class="text-background-400">
						Last Active: {new Date(stats.lastActive).toLocaleString()}
					</p>
				{/if}
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
								<td class="text-left pl-2">{convertIskToBillions(stats.iskKilled, 2)}</td>
							</tr>
							<tr>
								<td class="font-bold p-1">ISK Lost:</td>
								<td class="text-left pl-2">{convertIskToBillions(stats.iskLost, 2)}</td>
							</tr>
						</tbody>
					</table>

					<!-- Right Table: Solo Kills, Kill Points, etc. -->
					<table class="table-auto w-1/2 text-right">
						<tbody>
							<tr>
								<td class="font-bold p-1">NPC Losses:</td>
								<td class="text-left pl-2">{formatNumber(stats.npcLosses, 0)}</td>
							</tr>
							<tr>
								<td class="font-bold p-1">Solo Kills:</td>
								<td class="text-left pl-2">{formatNumber(stats.soloKills, 0)}</td>
							</tr>
							<tr>
								<td class="font-bold p-1">Solo Losses:</td>
								<td class="text-left pl-2">{formatNumber(stats.soloLosses, 0)}</td>
							</tr>
							<tr>
								<td class="font-bold p-1">Last Active:</td>
								<td class="text-left pl-2">{new Date(stats.lastActive).toLocaleString()}</td>
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
