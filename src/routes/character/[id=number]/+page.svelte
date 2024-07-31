<script lang="ts">
	import { getUpstreamUrl } from '$lib/Config';
	import type { Character } from '../../../types/Character.ts';
	import { onMount } from 'svelte';
	import Information from './information.svelte';
	import Kills from './kills.svelte';
	import Losses from './losses.svelte';
	import CorporationHistory from './corporationHistory.svelte';

	export let data;
	let character: Character;
	let activeComponent = Information;
	const upstreamUrl = getUpstreamUrl();

	onMount(async () => {
		const response = await fetch(`${upstreamUrl}/api/characters/${data.id}`);
		character = await response.json();
		if (character.error) {
			window.location.href = '/';
		}
	});

	function loadComponent(component: any) {
		activeComponent = component;
	}
</script>

{#if character}
	<div class="container mx-auto p-4 text-white">
		<!-- Profile Section -->
		<div class="flex items-start">
			<!-- Profile Image with Additional Images -->
			<div class="flex items-center">
				<img
					src="https://images.evetech.net/characters/{character.character_id}/portrait?size=256"
					alt="Character: {character.name}"
					class="rounded-full"
				/>
				<div class="flex flex-col space-x-2 space-y-2">
					<img
						src="https://images.evetech.net/corporations/{character.corporation_id}/logo?size=64"
						alt="Corporation: {character.corporation_name}"
						class="rounded-full"
					/>
					<img
						src="https://images.evetech.net/alliances/{character.alliance_id}/logo?size=64"
						alt="Alliance: {character.alliance_name}"
						class="rounded-full"
					/>
					<img
						src="https://images.evetech.net/corporations/{character.faction_id}/logo?size=64"
						alt="Faction: {character.faction_name}"
						class="rounded-full"
					/>
				</div>
			</div>

			<!-- Profile Information Tables -->
			<div class="w-2/3 flex justify-between ml-5">
				<!-- First Table next to the image -->
				<div>
					<table class="table-auto">
						<tbody>
							<tr>
								<td class="font-bold text-right p-2">Character:</td>
								<td>{character.name}</td>
							</tr>
							<tr on:click={(window.location.href = `/corporation/${character.corporation_id}`)}>
								<td class="font-bold text-right p-2">Corporation:</td>
								<td>{character.corporation_name}</td>
							</tr>
							<tr on:click={(window.location.href = `/alliance/${character.alliance_id}`)}>
								<td class="font-bold text-right p-2">Alliance:</td>
								<td>{character.alliance_name}</td>
							</tr>
							<tr on:click={(window.location.href = `/faction/${character.faction_id}`)}>
								<td class="font-bold text-right p-2">Faction:</td>
								<td>{character.faction_name}</td>
							</tr>
							<tr>
								<td class="font-bold text-right p-2">Sec. Status:</td>
								<td>{character.security_status.toFixed(3)}</td>
							</tr>
						</tbody>
					</table>
				</div>
				<div class="hidden">
					<table class="table-auto">
						<tbody>
							<tr>
								<td class="font-bold">Hidden:</td>
								<td>More Info?</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>

		<!-- Navbar -->
		<div class="mt-4">
			<nav class="bg-semi-transparent text-white py-2 px-4 rounded">
				<ul class="flex space-x-4">
					<li class="hover:underline" on:click|preventDefault={() => loadComponent(Information)}>
						Info
					</li>
					<li class="hover:underline" on:click|preventDefault={() => loadComponent(Kills)}>
						Kills
					</li>
					<li class="hover:underline" on:click|preventDefault={() => loadComponent(Losses)}>
						Losses
					</li>
					<li
						class="hover:underline"
						on:click|preventDefault={() => loadComponent(CorporationHistory)}
					>
						Corporation History
					</li>
				</ul>
			</nav>
		</div>

		<!-- Main content -->
		<div class="container mt-4 p-4 rounded">
			{#if activeComponent}
				<svelte:component this={activeComponent} {character} />
			{/if}
		</div>
	</div>
{/if}
