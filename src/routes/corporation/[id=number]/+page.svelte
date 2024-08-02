<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { getUpstreamUrl } from '$lib/Config';
	import type { Corporation } from '../../../types/Corporation.ts';
	import Information from './information.svelte';
	import Kills from './kills.svelte';
	import Losses from './losses.svelte';
	import Members from './members.svelte';

	export let data;
	let corporation: Corporation;
	let activeComponent = Information;
	const upstreamUrl = getUpstreamUrl();

	// Function to map hash to component
	const hashToComponent = {
		'#info': Information,
		'#kills': Kills,
		'#losses': Losses,
		'#members': Members
	};

	// Load the appropriate component based on the URL hash
	function loadComponentFromHash(hash) {
		if (!hash || hash === '#') {
			activeComponent = Information; // Load Information by default if no hash or empty hash is present
		} else {
			const component = hashToComponent[hash];
			activeComponent = component || Information;
		}
	}

	onMount(async () => {
		const response = await fetch(`${upstreamUrl}/api/corporations/${data.id}`);
		corporation = await response.json();
		if (corporation.error) {
			window.location.href = '/';
		} else {
			// Check if the URL has a hash, if not, add #info and replace history
			if (!window.location.hash || window.location.hash === '#') {
				history.replaceState(null, '', `${window.location.pathname}#info`);
				loadComponentFromHash('#info');
			} else {
				// Load the component based on the current hash
				loadComponentFromHash(window.location.hash);
			}
		}
	});

	function loadComponent(component, hash) {
		activeComponent = component;
		window.location.hash = hash;
	}

	// Watch for URL changes to update the active component
	page.subscribe(($page) => {
		loadComponentFromHash($page.url.hash);
	});
</script>

{#if corporation}
	<div class="container mx-auto p-4 text-white">
		<!-- Profile Section -->
		<div class="flex items-start">
			<!-- Profile Image with Additional Images -->
			<div class="flex items-center">
				<img
					src="https://images.evetech.net/corporations/{corporation.corporation_id}/logo?size=256"
					alt="Corporation: {corporation.name}"
					class="rounded-full"
				/>
				<div class="flex flex-col space-x-2 space-y-2">
					<img
						src="https://images.evetech.net/alliances/{corporation.alliance_id}/logo?size=64"
						alt="Alliance: {corporation.alliance_name}"
						class="rounded-full"
					/>
					<img
						src="https://images.evetech.net/corporations/{corporation.faction_id}/logo?size=64"
						alt="Faction: {corporation.faction_name}"
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
								<td class="font-bold text-right p-1">Corporation:</td>
								<td>{corporation.name}</td>
							</tr>
							<tr>
								<td class="font-bold text-right p-1">Ticker:</td>
								<td>{corporation.ticker}</td>
							</tr>
							<tr
								on:click={() =>
									(window.location.href = `/alliance/${corporation.alliance_id}`)}
							>
								<td class="font-bold text-right p-1">Alliance:</td>
								<td>{corporation.alliance_name}</td>
							</tr>
							<tr
								on:click={() =>
									(window.location.href = `/faction/${corporation.faction_id}`)}
							>
								<td class="font-bold text-right p-1">Faction:</td>
								<td>{corporation.faction_name}</td>
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
					<li>
						<a
							href="#info"
							class="hover:underline"
							on:click|preventDefault={() => loadComponent(Information, '#info')}
						>
							Info
						</a>
					</li>
					<li>
						<a
							href="#kills"
							class="hover:underline"
							on:click|preventDefault={() => loadComponent(Kills, '#kills')}
						>
							Kills
						</a>
					</li>
					<li>
						<a
							href="#losses"
							class="hover:underline"
							on:click|preventDefault={() => loadComponent(Losses, '#losses')}
						>
							Losses
						</a>
					</li>
					<li>
						<a
							href="#members"
							class="hover:underline"
							on:click|preventDefault={() => loadComponent(Members, '#members')}
						>
							Members
						</a>
					</li>
				</ul>
			</nav>
		</div>

		<!-- Main content -->
		<div class="container mt-4 p-4 rounded">
			{#if activeComponent}
				<svelte:component this={activeComponent} {corporation} />
			{/if}
		</div>
	</div>
{/if}
