<script lang="ts">
	import type { Killmail } from '$lib/types/Killmail';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { stompConnection } from '$lib/Stomp.ts';
	import { fetchKillList } from '$lib/fetchKillList.ts';
	import { formatNumber } from '$lib/Helpers.ts';

	export let url: string;
	export let title: string = '';
	export let subscriptionTopic: string = 'all';
	export let filter: { field: string; value: any } | null = null;
	export let combinedKillsAndLosses: boolean = false;
	export let combinedVictimType: string = 'character';
	export let combinedVictimId: number;

	let kills: Killmail[] = [];
	let page: number = 1;
	let loading: boolean = false;
	let isPaused: boolean = false;
	let pauseTimeout: any;
	let queuedKills: Killmail[] = [];

	onMount(() => {
		const urlParams = new URLSearchParams(window.location.search);
		const pageParam = urlParams.get('killlistPage');
		if (pageParam) {
			page = parseInt(pageParam, 10);
		}
		loadKills();
		let topic = '/exchange/killmail_topic_exchange/' + subscriptionTopic;
		stompConnection(topic, handleIncomingMessage);
	});

	async function loadKills() {
		if (loading) return;
		loading = true;
		const newKills: Killmail[] = await fetchKillList(url, page);
		kills = newKills.slice(0, 100);
		updateURL();
		loading = false;
	}

	function updateURL() {
		const newUrl = new URL(window.location.href);
		newUrl.searchParams.set('killlistPage', String(page));
		goto(newUrl.toString(), { replaceState: true });
	}

	function handleIncomingMessage(message: Killmail) {
		if (page !== 1) return;

		if (filter && !matchesFilter(message, filter)) {
			return;
		}

		if (isPaused) {
			queuedKills.push(message);
		} else {
			addKillToList(message);
		}
	}

	function matchesFilter(killmail: Killmail, filter: { field: string; value: any }): boolean {
		const keys = filter.field.split('.');
		let current: any = killmail;
		for (const key of keys) {
			if (Array.isArray(current)) {
				return current.some((item) => item[key] === filter.value);
			} else {
				current = current[key];
			}
			if (current === undefined) {
				return false;
			}
		}
		return current === filter.value;
	}

	function addKillToList(message: Killmail) {
		if (!kills.find((kill) => kill.killmail_id === message.killmail_id)) {
			kills = [message, ...kills];
		}
		if (kills.length > 100) {
			kills.pop();
		}
	}

	function pauseAddingKills() {
		clearTimeout(pauseTimeout);
		isPaused = true;
		pauseTimeout = setTimeout(() => {
			isPaused = false;
			while (queuedKills.length > 0) {
				addKillToList(queuedKills.shift()!);
			}
		}, 2500);
	}

	function handleClick(event: MouseEvent, killmailId: string) {
		if (event.ctrlKey || event.metaKey || event.button === 1) {
			event.preventDefault();
			window.open(`/kill/${killmailId}`, '_blank');
		} else {
			window.location.href = `/kill/${killmailId}`;
		}
	}

	// Helper function to check if the kill is a loss that should be highlighted
	function isCombinedLoss(kill: Killmail): boolean {
		if (combinedKillsAndLosses && kill.victim[`${combinedVictimType}_id`] === combinedVictimId) {
			return true;
		}
		return false;
	}

	function truncateString(str: any, num: number) {
		let stringifiedStr = String(str);
		return stringifiedStr.length <= num ? stringifiedStr : stringifiedStr.slice(0, num) + '...';
	}

	function changePage(newPage: number) {
		if (newPage > 0) {
			page = newPage;
			loadKills();
		}
	}
	function getFinalBlowAttacker(kill: Killmail) {
		if (Array.isArray(kill.attackers)) {
			for (const attacker of kill.attackers) {
				if (attacker.final_blow) {
					return attacker;
				}
			}
		}
		return null;
	}
</script>

{#if title !== undefined}
	<h1 class="text-white">{title}</h1>
{/if}

<!-- Pagination Control at the Top -->
<div class="flex justify-between items-center mb-4">
	<button
		on:click={() => changePage(page - 1)}
		disabled={page === 1 || loading}
		class="px-4 py-2 text-sm font-medium text-white bg-background-800 rounded-md hover:bg-background-700 disabled:opacity-50"
	>
		Previous
	</button>
	<span class="text-white">Page {page}</span>
	<button
		on:click={() => changePage(page + 1)}
		disabled={loading}
		class="px-4 py-2 text-sm font-medium text-white bg-background-800 rounded-md hover:bg-background-700 disabled:opacity-50"
	>
		Next
	</button>
</div>

<div class="overflow-x-auto" role="table">
	<div class="grid grid-cols-4 bg-background-800 text-white uppercase text-xs py-1">
		<div class="text-center">Ship</div>
		<div class="text-center">Victim</div>
		<div class="text-center">Final Blow</div>
		<div class="text-center">Location</div>
	</div>

	{#each kills as kill (kill.killmail_id)}
		<button
			class="grid grid-cols-4 items-center border-b bg-semi-transparent border-background-700 hover:bg-background-800 transition-colors duration-300 cursor-pointer w-full {isCombinedLoss(
				kill
			)
				? 'bg-red-800'
				: ''}"
			on:click={(event) => handleClick(event, kill.killmail_id)}
			on:mouseover={pauseAddingKills}
			on:focus={pauseAddingKills}
		>
			<div class="flex items-center mx-2 py-1 w-fit">
				<img src="{kill.victim.ship_image_url}?size=64" alt="Ship: {kill.victim.ship_name}" class="rounded w-10" />
				<div class="flex flex-col items-start ml-1 whitespace-nowrap">
					<span class="text-sm">{truncateString(kill.victim.ship_name, 20)}</span>
					{#if kill.total_value > 50}
						<span class="text-background-400 text-xs">
							{formatNumber(kill.total_value)} ISK
						</span>
					{/if}
				</div>
			</div>

			<div class="flex items center px-2 py-1">
				<img src="{kill.victim.character_image_url}?size=64" alt="Character: {kill.victim.character_name}" class="rounded w-10" />
				<div class="flex flex-col items-start ml-1">
					<span class="text-sm">{kill.victim.character_name}</span>
					<span class="text-background-400 text-xs whitespace-nowrap">
						{truncateString(kill.victim.corporation_name, 22)}
					</span>
				</div>
			</div>

			<div class="flex flex-col items-start px-2 py-1 whitespace-nowrap">
				{#if Array.isArray(kill.attackers)}
					{@const finalBlowAttacker = getFinalBlowAttacker(kill)}

					<span class="text-sm">
						{kill.is_npc ? finalBlowAttacker.faction_name : finalBlowAttacker.character_name}
					</span>
					<span class="text-background-400 text-xs">
						{truncateString(finalBlowAttacker.ship_group_name, 22)}
					</span>
				{/if}
			</div>

			<div class="flex flex-col items-end px-2 py-1 text-sm whitespace-nowrap">
				<span>{kill.region_name} / {kill.system_name}</span>
				<div class="text-background-500">{kill.kill_time}</div>
				<div class="flex gap-1 items-center">
					<span class="text-background-400">{kill.attackers.length}</span>
					<img src="/images/involved.png" alt="{kill.attackers.length} Involved" />
					<span class="text-background-400">{kill.comment_count || 0}</span>
					<img src="/images/comment.gif" alt="{kill.attackers.length} Involved" />
				</div>
			</div>
		</button>
	{/each}
</div>

<!-- Pagination Control at the Bottom -->
<div class="flex justify-between items-center mt-4">
	<button
		on:click={() => changePage(page - 1)}
		disabled={page === 1 || loading}
		class="px-4 py-2 text-sm font-medium text-white bg-background-800 rounded-md hover:bg-background-700 disabled:opacity-50"
	>
		Previous
	</button>
	<span class="text-white">Page {page}</span>
	<button
		on:click={() => changePage(page + 1)}
		disabled={loading}
		class="px-4 py-2 text-sm font-medium text-white bg-background-800 rounded-md hover:bg-background-700 disabled:opacity-50"
	>
		Next
	</button>
</div>

<style>
	.bg-darkred {
		background-color: rgb(40, 0, 0);
	}
</style>
