<script lang="ts">
	import { onMount } from 'svelte';
	import { getUpstreamUrl } from '$lib/Config';
	import type { Killmail } from '$lib/types/Killmail.js';
	import { backendFetch } from '$lib/backendFetcher';

	export let item;
	let itemId = item.type_id;
	let killmails: Killmail[] = [];
	const upstreamUrl = getUpstreamUrl();
	let itemKillmailsUrl = `${upstreamUrl}/api/items/${itemId}/killmails?limit=20`;

	onMount(async () => {
		let request = await backendFetch(itemKillmailsUrl);
		killmails = await request.json();
	});

	function handleKillmailClick(killmailId: number) {
		window.location.href = `/kill/${killmailId}`;
	}
</script>

<div class="w-full p-4 rounded bg-opacity-75">
	<h2 class="text-xl font-bold mb-4">Latest Kills</h2>
	<div class="overflow-x-auto" role="table">
		<table class="table-auto min-w-full bg-semi-transparent rounded-lg shadow-lg">
			<tbody class="text-background-300 text-sm">
				{#each killmails as kill (kill.killmail_id)}
					<tr class="hover:bg-background-600 transition-colors duration-300 cursor-pointer" on:click={() => handleKillmailClick(kill.killmail_id)}>
						<td class="flex items-center space-x-2">
							<a href={`/kill/${kill.killmail_id}`}>
								<img
									src={`https://images.eve-kill.com/types/${kill.victim.ship_id}/render?size=64`}
									class="rounded w-16 h-16 m-1"
									alt={kill.victim.ship_name}
								/>
							</a>
							<a href={`/character/${kill.victim.character_id}`}>
								<img
									src={`https://images.eve-kill.com/characters/${kill.victim.character_id}/portrait?size=64`}
									class="rounded w-16 h-16 m-1"
									alt={kill.victim.character_name}
								/>
							</a>
							<a href={`/corporation/${kill.victim.corporation_id}`}>
								<img
									src={`https://images.eve-kill.com/corporations/${kill.victim.corporation_id}/logo?size=64`}
									class="rounded w-16 h-16 m-1"
									alt={kill.victim.corporation_name}
								/>
							</a>
							{#if kill.victim.alliance_id}
								<a href={`/alliance/${kill.victim.alliance_id}`}>
									<img
										src={`https://images.eve-kill.com/alliances/${kill.victim.alliance_id}/logo?size=64`}
										class="rounded w-16 h-16 m-1"
										alt={kill.victim.alliance_name}
									/>
								</a>
							{/if}
						</td>
						<td class="pl-5">
							<div class="text-sm">
								<a href={`/kill/${kill.killmail_id}`} class="text-primary-400">{kill.victim.character_name} ({kill.victim.ship_name})</a><br />
								<a href={`/corporation/${kill.victim.corporation_id}`} class="text-primary-400">{kill.victim.corporation_name}</a><br />
								{#if kill.victim.alliance_name}
									<a href={`/alliance/${kill.victim.alliance_id}`} class="text-primary-400">{kill.victim.alliance_name}</a><br />
								{/if}
							</div>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
