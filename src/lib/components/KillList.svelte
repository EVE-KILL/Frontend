<script lang="ts">
	import moment from 'moment';

	import type { Killmail } from '$lib/types/Killmail';
	import { onMount } from 'svelte';
	// import { goto } from '$app/navigation';
	import { formatNumber } from '$lib/Helpers.ts';

	import { useColors } from '$lib/models/useColors';
	import KillListFilters from '$lib/components/KillListFilters.svelte';
	const { getSecurityColor } = useColors();

	import { useKillmails } from '$lib/models/useKillmails';
	import { killmails } from '$lib/stores/killmails';
	const { getPage, pauseHandlingMessages, enableSubscription } = useKillmails();

	// export let url: string;
	export let title: string = '';
	// export let subscriptionTopic: string = 'all';
	// export let filter: { field: string; value: any } | null = null;
	// export let combinedKillsAndLosses: boolean = false;
	// export let victimType: string = 'character';
	export let victimId: number | undefined = undefined;
	export let withFilters: boolean = false;
	export let withKillLossColors: boolean = false;
	export let withSubscription: boolean = false;

	let kills: Killmail[] = [];
	let page: number = 1;
	let loading: boolean = false;
	let showFilters: boolean = false;

	$: {
		let killData = $killmails;
		if (killData) {
			kills = killData.data;
		}
	}

	onMount(() => {
		const urlParams = new URLSearchParams(window.location.search);
		const pageParam = urlParams.get('killlistPage');
		if (pageParam) {
			page = parseInt(pageParam, 10);
		}

		enableSubscription(withSubscription);
	});

	// function updateURL() {
	// 	const newUrl = new URL(window.location.href);
	// 	newUrl.searchParams.set('killlistPage', String(page));
	// 	goto(newUrl.toString(), { replaceState: true });
	// }

	// function matchesFilter(killmail: Killmail, filter: { field: string; value: any }): boolean {
	// 	const keys = filter.field.split('.');
	// 	let current: any = killmail;
	// 	for (const key of keys) {
	// 		if (Array.isArray(current)) {
	// 			return current.some((item) => item[key] === filter.value);
	// 		} else {
	// 			current = current[key];
	// 		}
	// 		if (current === undefined) {
	// 			return false;
	// 		}
	// 	}
	// 	return current === filter.value;
	// }

	function handleClick(event: MouseEvent, killmailId: string) {
		if (event.ctrlKey || event.metaKey || event.button === 1) {
			event.preventDefault();
			window.open(`/kill/${killmailId}`, '_blank');
		} else {
			window.location.href = `/kill/${killmailId}`;
		}
	}

	function changePage(newPage: number) {
		page = newPage;
		getPage(page);
	}

	// const getFinalBlowAttacker = (kill: Killmail) => {
	// 	if (Array.isArray(kill.attackers)) {
	// 		for (const attacker of kill.attackers) {
	// 			if (attacker.final_blow) {
	// 				return attacker;
	// 			}
	// 		}
	// 	}
	// 	return null;
	// };

	const getNumCharacters = (kill: Killmail) => {
		// we need to make sure to filter out NPCs
		return kill.attackers.filter((attacker) => attacker.character_id).length;
	};

	const getNumCorps = (kill: Killmail) => {
		const corps = new Set();
		for (const attacker of kill.attackers) {
			// we need to make sure to filter out NPCs
			if (attacker.corporation_id) {
				corps.add(attacker.corporation_id);
			}
		}
		return corps.size;
	};

	const getNumAlliances = (kill: Killmail) => {
		const alliances = new Set();
		for (const attacker of kill.attackers) {
			// we need to make sure to filter out NPCs
			if (attacker.alliance_id) {
				alliances.add(attacker.alliance_id);
			}
		}
		return alliances.size;
	};

	const getBackgroundColor = (kill: Killmail) => {
		if (withKillLossColors) {
			if (kill.victim.character_id === victimId) {
				return 'bg-red-900';
			}
			if (kill.attackers.some((attacker) => attacker.character_id === victimId)) {
				return 'bg-green-900';
			}
		}
		return 'bg-black';
	};

	const getMostShipGroups = (kill: Killmail) => {
		// we want to return the count and group name
		const shipGroups = new Map();
		const shipGroupNames = new Map();

		for (const attacker of kill.attackers) {
			if (attacker.ship_group_id) {
				if (shipGroups.has(attacker.ship_group_id)) {
					shipGroups.set(attacker.ship_group_id, shipGroups.get(attacker.ship_group_id) + 1);
				} else {
					shipGroups.set(attacker.ship_group_id, 1);
					shipGroupNames.set(attacker.ship_group_id, attacker.ship_group_name);
				}
			}
		}

		// Sort the groups by count (descending)
		const sorted = Array.from(shipGroups.entries()).sort((a, b) => b[1] - a[1]);

		let result = [];
		let totalRemaining = 0;

		// Push the top 2 ship groups
		for (let i = 0; i < Math.min(2, sorted.length); i++) {
			const [shipGroupId, count] = sorted[i];
			result.push({
				id: shipGroupId,
				name: shipGroupNames.get(shipGroupId),
				count
			});
		}

		// Check if there are more than 2 ship groups and calculate the remaining count
		if (sorted.length > 2) {
			for (let i = 2; i < sorted.length; i++) {
				totalRemaining += sorted[i][1];
			}
			result.push({
				id: null,
				name: `More`,
				count: totalRemaining
			});
		}

		return result;
	};
</script>

{#if title !== undefined}
	<h1 class="text-white">{title}</h1>
{/if}

<!-- Pagination Control at the Top -->
<div class="flex mb-2">
	{#if withFilters}
		<button
			on:click={() => (showFilters = !showFilters)}
			class="px-2 py-1 text-sm font-medium text-white bg-background-800 rounded-md hover:bg-background-700"
		>
			{showFilters ? 'Hide Filters' : 'Show Filters'}
		</button>
	{/if}

	<div class="flex-grow"></div>
	<div class="flex items-center gap-2">
		<button
			on:click={() => changePage(page - 1)}
			disabled={page === 1 || loading}
			class="px-2 py-1 text-sm font-medium text-white bg-background-800 rounded-md hover:bg-background-700 disabled:opacity-50"
		>
			Previous
		</button>
		<span class="text-sm text-white">Page {page}</span>
		<button
			on:click={() => changePage(page + 1)}
			disabled={loading}
			class="px-2 py-1 text-sm font-medium text-white bg-background-800 rounded-md hover:bg-background-700 disabled:opacity-50"
		>
			Next
		</button>
	</div>
</div>

{#if withFilters}
	<div style="display: {showFilters ? 'flex' : 'none'}">
		<KillListFilters />
	</div>
{/if}

<div class="overflow-x-auto" role="table">
	<div class="grid grid-cols-[230px,1fr,130px,1fr,120px,150px] bg-background-800 text-white uppercase text-xs py-1">
		<div class="pl-2 col-span-2">Victim</div>
		<div class="pl-2 col-span-1">Orgs Involved</div>
		<div class="pl-2 col-span-1">Ships Involved</div>
		<!-- <div class="pl-2 col-span-2">Final Blow</div> -->
		<div class="pl-2">Location</div>
		<div class="text-right pr-2">Details</div>
	</div>

	{#each kills as kill (kill.killmail_id)}
		<button
			class="grid grid-cols-[230px,1fr,130px,1fr,120px,150px] items-center bg-opacity-80 border-b border-black hover:bg-primary-900 transition-colors duration-300 cursor-pointer w-full {getBackgroundColor(
				kill
			)}"
			on:click={(event) => handleClick(event, kill.killmail_id)}
			on:mouseover={pauseHandlingMessages}
			on:focus={pauseHandlingMessages}
		>
			<div class="flex items-center mx-2 py-1 w-fit">
				<img src="{kill.victim.ship_image_url}?size=64" alt="Ship: {kill.victim.ship_name}" class="rounded w-10" />
				<div class="flex flex-col items-start ml-1 whitespace-nowrap">
					<span class="text-sm text-left truncate w-full">{kill.victim.ship_name}</span>
					{#if kill.total_value > 50}
						<span class="text-background-400 text-xs">
							{formatNumber(kill.total_value)} ISK
						</span>
					{/if}
				</div>
			</div>

			<div class="flex items-center px-2 py-1">
				<img src="{kill.victim.character_image_url}?size=64" alt="Character: {kill.victim.character_name}" class="rounded w-10" />
				<div class="flex flex-col items-start ml-1">
					<span class="text-sm">{kill.victim.character_name}</span>
					<span class="text-background-400 text-xs whitespace-nowrap">
						{kill.victim.corporation_name}
					</span>
				</div>
			</div>

			<!-- Orgs Involved -->
			<div class="flex items-center mx-2 py-1 w-fit">
				<div class="flex flex-col items-start text-background-200">
					<div class="flex items-center">
						<img src="/images/involved.png" alt="{kill.attackers.length} Involved" style="height: 10px; width: 10px" />
						<span class="text-xs ml-1">{getNumCharacters(kill)} Characters</span>
					</div>
					<div class="flex items-center">
						<img src="/images/involved.png" alt="{kill.attackers.length} Involved" style="height: 10px; width: 10px; filter: hue-rotate(220deg);" />
						<span class="text-xs ml-1">{getNumCorps(kill)} Corporations</span>
					</div>
					<div class="flex items-center">
						<img src="/images/involved.png" alt="{kill.attackers.length} Involved" style="height: 10px; width: 10px; filter: hue-rotate(-60deg);" />
						<span class="text-xs ml-1">{getNumAlliances(kill)} Alliances</span>
					</div>
				</div>
			</div>

			<!-- Ships Involved -->
			<div class="flex flex-col items-start px-2 py-1 text-sm">
				{#each getMostShipGroups(kill) as { id: shipTypeId, name, count }}
					<div class="text-xs text-background-300 text-left truncate">{count}x {name}</div>
				{/each}
			</div>

			<!-- <div class="flex items-center mx-2 py-1 overflow-hidden">
				{#if Array.isArray(kill.attackers)}
					{@const finalBlowAttacker = getFinalBlowAttacker(kill)}
					<img src="{finalBlowAttacker.ship_image_url}?size=64" alt="Ship: {finalBlowAttacker.ship_name}" class="rounded w-10" />
					<div class="flex flex-col flex-shrink items-start ml-1 whitespace-nowrap overflow-hidden">
						<span class="text-sm text-left truncate w-full">{finalBlowAttacker.ship_name}</span>
						<span class="text-background-400 text-xs text-left truncate w-full">
							{finalBlowAttacker.ship_group_name}
						</span>
					</div>
				{/if}
			</div>

			<div class="flex items-center px-2 py-1 whitespace-nowrap">
				{#if Array.isArray(kill.attackers)}
					{@const finalBlowAttacker = getFinalBlowAttacker(kill)}
					{#if !kill.is_npc}
						<img src="{finalBlowAttacker.character_image_url}?size=64" alt="Character: {kill.victim.character_name}" class="rounded w-10" />
					{:else}
						<img src="https://images.evetech.net/characters/0/portrait?size=128" alt="Unknown" class="rounded w-10" />
					{/if}

					<div class="flex flex-col items-start ml-1">
						<span class="text-sm">
							{#if kill.is_npc}
								{finalBlowAttacker.faction_name}
							{:else}
								{finalBlowAttacker.character_name}
							{/if}
						</span>
						<span class="text-background-400 text-xs">
							{finalBlowAttacker.corporation_name}
						</span>
					</div>
				{/if}
			</div> -->

			<div class="flex flex-col items-start px-2 py-1 text-sm">
				<div class="flex flex-col items-start">
					<span class="text-sm whitespace-nowrap">{kill.region_name}</span>
					<div class="text-background-400 text-xs whitespace-nowrap">
						<span>{kill.system_name}</span>
						(<span style="color: {getSecurityColor(kill.system_security)}">{formatNumber(kill.system_security)}</span>)
					</div>
				</div>
			</div>

			<div class="flex flex-col items-end px-2 py-1 text-sm whitespace-nowrap">
				{kill.kill_time}
				<div class="text-background-500">{moment.unix(kill.kill_time).format('YYYY-MM-DD HH:mm')}</div>
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
