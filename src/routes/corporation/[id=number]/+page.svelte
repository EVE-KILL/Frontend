<script lang="ts">
	import { getUpstreamUrl } from '$lib/Config';
	import type { Corporation } from '../../../types/Corporation.ts';
	import { onMount } from 'svelte';
	import Information from './information.svelte';
	import Kills from './kills.svelte';
	import Losses from './losses.svelte';
	import Members from './members.svelte';

	export let data;
	let corporation: Corporation;
	let activeComponent = Information;
	const upstreamUrl = getUpstreamUrl();

	onMount(async () => {
		const response = await fetch(`${upstreamUrl}/api/corporations/${data.id}`);
		corporation = await response.json();
		if (corporation.error) {
			window.location.href = '/';
		}
	});

	function loadComponent(component: any) {
		activeComponent = component;
	}
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
								<td class="font-bold text-right p-2">Corporation:</td>
								<td>{corporation.name}</td>
							</tr>
							<tr on:click={(window.location.href = `/alliance/${corporation.alliance_id}`)}>
								<td class="font-bold text-right p-2">Alliance:</td>
								<td>{corporation.alliance_name}</td>
							</tr>
							<tr on:click={(window.location.href = `/faction/${corporation.faction_id}`)}>
								<td class="font-bold text-right p-2">Faction:</td>
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
					<li class="hover:underline" on:click|preventDefault={() => loadComponent(Information)}>
						Info
					</li>
					<li class="hover:underline" on:click|preventDefault={() => loadComponent(Kills)}>
						Kills
					</li>
					<li class="hover:underline" on:click|preventDefault={() => loadComponent(Losses)}>
						Losses
					</li>
					<li class="hover:underline" on:click|preventDefault={() => loadComponent(Members)}>
						Members
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
