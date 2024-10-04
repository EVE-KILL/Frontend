<script lang="ts">
	import type { Killmail } from '$lib/types/Killmail';
	import { formatNumber } from '$lib/Helpers.ts';
	import { onMount } from 'svelte';

	export let categories: { name: string; url: string }[] = [];

	let killsByCategory: { [key: string]: Killmail[] } = {};
	let activeCategory = categories[0].name;
	let loading = true;

	// Fetch kills when the component mounts
	onMount(() => fetchKills());

	async function fetchKills() {
		loading = true;
		for (let i = 0; i < categories.length; i++) {
			let response = await fetch(categories[i].url);
			killsByCategory[categories[i].name] = await response.json();
		}
		loading = false;
	}
</script>

<div class="flex flex-col min-w-full bg-semi-transparent rounded-lg shadow-lg overflow-hidden">
	<div class="flex justify-center bg-black">
		{#each categories as category}
			<button class="tab-btn text-xs" class:active-tab={activeCategory === category.name} on:click={() => (activeCategory = category.name)}>
				{category.name}
			</button>
		{/each}
	</div>

	{#if loading}
		<div class="flex justify-center items-center h-64">
			<div class="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16"></div>
		</div>
	{:else}
		<div class="flex gap-10 justify-center w-full py-2">
			{#each killsByCategory[activeCategory] as kill}
				<button class="flex flex-col items-center justify-center" on:click={() => (window.location.href = `/kill/${kill.killmail_id}`)}>
					<img src="https://images.eve-kill.com/types/{kill.victim.ship_id}/render?size=128" alt="Ship: {kill.victim.ship_name}" class="rounded" />
					<div class="text-center text-sm mt-1">
						{kill.victim.ship_name}
					</div>
					<div class="text-center text-xs mt-1">
						{formatNumber(kill.total_value)} ISK
					</div>
				</button>
			{/each}
		</div>

		<div class="text-sm text-center mt-2 text-background-400 pb-2"> (Over last 7 days) </div>
	{/if}
</div>

<style>
	.tab-btn {
		cursor: pointer;
		background-color: transparent;
		color: #a0aec0;
		padding: 0.5rem 1rem;
		border: none;
		outline: none;
		transition: color 0.3s ease;
	}

	.tab-btn:hover,
	.active-tab {
		color: #edf2f7;
	}

	.active-tab {
		border-bottom: 2px solid #edf2f7;
		font-weight: bold;
	}
</style>
