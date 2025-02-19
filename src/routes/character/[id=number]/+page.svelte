<script lang="ts">
	import type { Character } from '$lib/types/Character.ts';
	import Dashboard from './dashboard.svelte';
	import Kills from './kills.svelte';
	import Losses from './losses.svelte';
	import Combined from './combined.svelte';
	import CorporationHistory from './corporationHistory.svelte';
	import Stats from './Stats.svelte';
	import StatusTop from './statusTop.svelte'; // Import the new component
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';

	export let data;
	let character: Character = data.character;
	let activeComponent = Dashboard;
	let currentHash = '#dashboard';

	const hashToComponent = {
		'#dashboard': Dashboard,
		'#combined': Combined,
		'#kills': Kills,
		'#losses': Losses,
		'#corporation-history': CorporationHistory,
		'#stats': Stats
	};

	function loadComponentFromHash(hash: keyof typeof hashToComponent) {
		if (!hash) {
			activeComponent = Dashboard;
			currentHash = '#dashboard';
		} else {
			const component = hashToComponent[hash];
			activeComponent = component || Dashboard;
			currentHash = hash;
		}
	}

	function loadComponent(component, hash: string) {
		if (window.location.hash === hash) return;
		history.pushState(null, '', hash);
		activeComponent = component;
		currentHash = hash;
	}

	// Handle popstate for navigation
	const popstateHandler = () => {
		loadComponentFromHash(window.location.hash);
	};

	// Use onMount for browser-only code
	onMount(() => {
		if (browser) {
			// Initial hash check
			const hash = window.location.hash;
			if (!hash || hash === '#') {
				history.replaceState(null, '', '#dashboard');
				loadComponentFromHash('#dashboard');
			} else {
				loadComponentFromHash(hash);
			}
			window.addEventListener('popstate', popstateHandler);
		}
	});

	onDestroy(() => {
		if (browser) {
			window.removeEventListener('popstate', popstateHandler);
		}
	});
</script>

{#if character}
	<div class="mx-auto p-4 text-white">
		<!-- Character Profile Component -->
		<StatusTop {character} />

		<!-- Navbar -->
		<div>
			<nav class="bg-semi-transparent text-white py-2 px-4 rounded">
				<ul class="flex space-x-4">
					<li>
						<a
							href="#dashboard"
							class="hover:underline {currentHash === '#dashboard' ? 'active' : ''}"
							on:click|preventDefault={() => loadComponent(Dashboard, '#dashboard')}
						>
							Dashboard
						</a>
					</li>
					<li>
						<a
							href="#kills"
							class="hover:underline {currentHash === '#kills' ? 'active' : ''}"
							on:click|preventDefault={() => loadComponent(Kills, '#kills')}
						>
							Kills
						</a>
					</li>
					<li>
						<a
							href="#losses"
							class="hover:underline {currentHash === '#losses' ? 'active' : ''}"
							on:click|preventDefault={() => loadComponent(Losses, '#losses')}
						>
							Losses
						</a>
					</li>
					<li>
						<a
							href="#combined"
							class="hover:underline {currentHash === '#combined' ? 'active' : ''}"
							on:click|preventDefault={() => loadComponent(Combined, '#combined')}
						>
							Combined
						</a>
					</li>
					<li>
						<a
							href="#corporation-history"
							class="hover:underline {currentHash === '#corporation-history' ? 'active' : ''}"
							on:click|preventDefault={() => loadComponent(CorporationHistory, '#corporation-history')}
						>
							Corporation History
						</a>
					</li>
					<li>
						<a
							href="#stats"
							class="hover:underline {currentHash === '#stats' ? 'active' : ''}"
							on:click|preventDefault={() => loadComponent(Stats, '#stats')}
						>
							Stats
						</a>
					</li>
				</ul>
			</nav>
		</div>

		<!-- Main content -->
		<div class="mt-4 rounded">
			{#if activeComponent}
				<svelte:component this={activeComponent} data={{ character }} />
			{/if}
		</div>
	</div>
{/if}

<style>
	.active {
		text-decoration: underline;
	}
</style>
