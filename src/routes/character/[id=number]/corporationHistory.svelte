<script lang="ts">
	import { backendFetch } from '$lib/backendFetcher.ts';
	import { getUpstreamUrl } from '$lib/Config';
	import type { Character } from '../../../types/Character.ts';
	import { onMount } from 'svelte';

	export let data: any;
	let character: Character = data.character;
	let corporationHistory = [];
	const upstreamUrl = getUpstreamUrl();
	let corporationHistoryUrl = `${upstreamUrl}/api/characters/${character.character_id}/corporationhistory`;

	onMount(async () => {
		const response = await backendFetch(corporationHistoryUrl);
		corporationHistory = await response.json();
	});
</script>

{#if corporationHistory.length > 0}
	<div class="overflow-x-auto" role="table">
		<table class="table-auto min-w-full bg-semi-transparent bg-background-800 rounded-lg shadow-lg">
			<thead>
				<tr class="bg-darker text-white uppercase text-xs leading-normal">
					<th class="px-2 py-1" scope="col">Corporation</th>
					<th class="px-2 py-1" scope="col">Join Date</th>
					<th class="px-2 py-1" scope="col">Leave Date</th>
				</tr>
			</thead>
			<tbody class="text-background-300 text-sm">
				{#each corporationHistory as history}
					<tr
						class="border-b border-background-700 hover:bg-background-600 transition-colors duration-300"
						on:click={() => (window.location.href = `/corporation/${history.corporation_id}`)}
					>
						<td class="px-2 py-1">
							{history.corporation_name}
							{#if history.alliance_id}
								&nbsp;(<a href={`/alliance/${history.alliance_id}`} class="text-primary-400 hover:underline">{history.alliance_name}</a>)
							{/if}
						</td>
						<td class="px-2 py-1">{history.start_date}</td>
						<td class="px-2 py-1">
							{#if history.end_date}
								{history.end_date}
							{/if}
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
{/if}
