<script lang="ts">
	import { getUpstreamUrl } from '$lib/Config.js';
	import type { Killmail } from '$lib/types/Killmail.ts';

	import Attackers from '$lib/components/Kill/Attackers.svelte';
	import Comments from '$lib/components/Kill/Comments.svelte';
	import FittingWheel from '$lib/components/Kill/FittingWheel.svelte';
	import Items from '$lib/components/Kill/Items.svelte';
	import InformationBox from '$lib/components/Kill/InformationBox.svelte';
	import Navbar from '$lib/components/Kill/Navbar.svelte';
	import { page } from '$app/stores';
	import { backendFetch } from '$lib/backendFetcher';
	import { onMount } from 'svelte';

	let id: number;
	let killmail: Killmail | null = null;
	let sibling: Killmail | null = null;
	let activeTab = 1;
	let tabs = [
		{ name: 'Comments', count: 0 },
		{ name: 'Attackers', count: 0 }
	];

	// Turn on reactivity after the component is mounted
	let mounted = false;
	onMount(() => {
		mounted = true;
	});

	// Use reactivity to reload elements on the page when navigating between /kill/123 and /kill/456
	$: id = parseInt($page.params.id, 10);
	$: {
		if (!isNaN(id) && mounted) {
			fetchKillmailData(id);
		}
	}

	async function fetchKillmailData(id: number) {
		try {
			const response = await backendFetch(`${getUpstreamUrl()}/api/killmail/${id}`);
			killmail = await response.json();

			const siblingResponse = await backendFetch(`${getUpstreamUrl()}/api/killmail/${id}/sibling`);
			const siblingIds = await siblingResponse.json();

			if (siblingIds.length === 1) {
				const siblingData = await backendFetch(`${getUpstreamUrl()}/api/killmail/${siblingIds[0]}`);
				sibling = await siblingData.json();
			}

			tabs = [
				{ name: 'Comments', count: killmail.comment_count || 0 },
				{ name: 'Attackers', count: killmail.attackers.length }
			];
		} catch (error) {
			console.error('Error fetching killmail data:', error);
		}
	}

	// Callback to receive the comment count from the Comments component
	function updateCommentCount(count: number) {
		tabs[0].count = count; // Update the comment count in the tabs array
	}
</script>

{#if killmail}
	<!-- Navbar -->
	<Navbar {killmail} {sibling} />

	<div class="flex p-2 pt-4 gap-2">
		<!-- Left Container -->
		<div class="w-full text-white p-4 rounded-lg shadow-lg">
			<div id="information-area" class="flex justify-around">
				<!-- Fitting Wheel -->
				{#key killmail}
					<FittingWheel {killmail} />
				{/key}

				<!-- Kill Information -->
				<div class="information-box ml-5">
					<InformationBox {killmail} />
				</div>
			</div>

			<!-- Items -->
			<Items {killmail} />
		</div>

		<!-- Right Container -->
		<div class="w-2/4 text-white p-4 rounded-lg shadow-lg" style="max-width: 500px;">
			<!-- Tabs -->
			<div class="tab-container">
				{#each tabs as tab, index}
					<button class="tab-btn" class:active-tab={activeTab === index} on:click={() => (activeTab = index)}>
						{tab.name}
						{#if tab.count}({tab.count}){/if}
					</button>
				{/each}
			</div>

			<!-- Tab content -->
			{#if activeTab === 0}
				<Comments identifier="kill:{killmail.killmail_id}" on:count={(e) => updateCommentCount(e.detail)} />
			{/if}
			{#if activeTab === 1}
				<Attackers attackers={killmail.attackers} />
			{/if}
		</div>
	</div>
{/if}

<style>
	.tab-container {
		display: flex;
		justify-content: center;
		margin-bottom: 1rem;
	}

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
