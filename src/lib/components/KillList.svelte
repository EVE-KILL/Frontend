<script lang="ts">
    import moment from 'moment';
    import { browser } from '$app/environment';
	import type { KillList } from '$lib/types/KillList';
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { fetchKillList } from '$lib/fetchKillList.ts';
    import { formatNumber } from '$lib/Helpers.ts';

    import { useColors } from '$lib/models/useColors';
	import { getUpstreamUrl } from '$lib/Config';
    const { getSecurityColor } = useColors();

    export let url: string;
    export let title: string = '';
    export let combinedKillsAndLosses: boolean = false;
    export let combinedVictimType: string = 'character';
    export let combinedVictimId: number | null = null;

    let kills: KillList[] = [];
    let page: number = 1;
    let loading: boolean = false;

    // **Add this line to track the previous URL**
    let previousUrl = '';

	onMount(() => {
		const urlParams = new URLSearchParams(window.location.search);
		const pageParam = urlParams.get('killlistPage');
		if (pageParam) {
			page = parseInt(pageParam, 10);
		}
		loadKills();
	});


    // **Modify the reactive statement to watch for changes in `url`**
    $: if (url && url !== previousUrl) {
        previousUrl = url;
        page = 1; // Reset the page if necessary
        //loadKills();
    }

    async function loadKills() {
        if (loading) return;
        loading = true;
        const newKills: KillList[] = await fetchKillList(url, page);
		if (!newKills.error) {
			kills = newKills.slice(0, 100) || [];
		}

        if (browser) {
            updateURL();
        }
        loading = false;
    }

    function updateURL() {
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.set('killlistPage', String(page));
        goto(newUrl.toString(), { replaceState: true });
    }

	function handleClick(event: MouseEvent, killmailId: number) {
		if (event.ctrlKey || event.metaKey || event.button === 1) {
			event.preventDefault();
			window.open(`/kill/${killmailId}`, '_blank');
		} else {
			window.location.href = `/kill/${killmailId}`;
		}
	}

	// Helper function to check if the kill is a loss that should be highlighted
	function isCombinedLoss(kill: KillList): boolean {
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
	<div class="grid grid-cols-8 bg-background-800 text-white uppercase text-xs py-1">
		<div class="pl-2 col-span-2">Ship</div>
		<div class="pl-2 col-span-2">Victim</div>
		<div class="pl-2 col-span-2">Final Blow</div>
		<div class="pl-2">Location</div>
		<div class="text-right pr-2">Details</div>
	</div>

	{#each kills as kill (kill.killmail_id)}
		<button
			class="grid grid-cols-8 items-center border-b bg-semi-transparent border-background-700 hover:bg-background-800 transition-colors duration-300 cursor-pointer w-full {isCombinedLoss(kill) ? 'bg-red-800' : ''}" on:click={(event) => handleClick(event, kill.killmail_id)}>
			<div class="flex items-center col-span-2 mx-2 py-1 w-fit">
				<img src="{getUpstreamUrl()}/images/types/{kill.victim.ship_id}/render?size=64" alt="Ship: {kill.victim.ship_name}" class="rounded w-10" />
				<div class="flex flex-col items-start ml-1 whitespace-nowrap">
					<span class="text-sm">{truncateString(kill.victim.ship_name, 20)}</span>
					{#if kill.total_value > 50}
						<span class="text-background-400 text-xs">
							{formatNumber(kill.total_value)} ISK
						</span>
					{/if}
				</div>
			</div>

			<div class="flex items-center col-span-2 px-2 py-1">
				<img src="{getUpstreamUrl()}/images/characters/{kill.victim.character_id}/portrait?size=64" alt="Character: {kill.victim.character_name}" class="rounded w-10" />
				<div class="flex flex-col items-start ml-1">
					<span class="text-sm">{kill.victim.character_name}</span>
					<span class="text-background-400 text-xs whitespace-nowrap">
						{truncateString(kill.victim.corporation_name, 22)}
					</span>
				</div>
			</div>

			<div class="flex items-center col-span-2 px-2 py-1 whitespace-nowrap">
				{#if !kill.is_npc}
					<img src="{getUpstreamUrl()}/images/characters/{kill.finalblow.character_id}/portrait?size=64" alt="Character: {kill.victim.character_name}" class="rounded w-10" />
				{:else}
					<img src="{getUpstreamUrl()}/images/characters/0/portrait?size=128" alt="Unknown" class="rounded w-10" />
				{/if}

				<div class="flex flex-col items-start ml-1">
					<span class="text-sm">
						{#if kill.is_npc}
							{kill.finalblow.faction_name}
						{:else}
							{kill.finalblow.character_name}
						{/if}
					</span>
					<span class="text-background-400 text-xs">
						{truncateString(kill.finalblow.ship_group_name, 22)}
					</span>
				</div>
			</div>

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
				<div class="text-background-500">{moment(kill.kill_time).fromNow()}</div>
				<div class="flex gap-1 items-center">
					<span class="text-background-400">{kill.attackerCount}</span>
					<img src="/img/involved.png" alt="{kill.attackerCount} Involved" />
					<span class="text-background-400">{kill.commentCount || 0}</span>
					<img src="/img/comment.gif" alt="{kill.attackerCount} Involved" />
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
