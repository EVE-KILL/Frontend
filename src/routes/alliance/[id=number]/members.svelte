<script lang="ts">
	import { getUpstreamUrl } from '$lib/Config';
	import type { Character } from '$lib/types/Character.ts';
	import type { Alliance } from '$lib/types/Alliance.ts';
	import { onMount } from 'svelte';
	import { backendFetch } from '$lib/backendFetcher';

	export let alliance: Alliance;
	export let members: Character[];
	const upstreamUrl = getUpstreamUrl();
	let url = `${upstreamUrl}/api/alliances/${alliance.alliance_id}/members`;

	onMount(async () => {
		const res = await backendFetch(url);
		members = await res.json();
	});
</script>

{#if members}
	<div class="overflow-x-auto" role="table">
		<table class="table-auto min-w-full bg-semi-transparent bg-background-800 rounded-lg shadow-lg">
			<thead>
				<tr class="bg-darker text-white uppercase text-xs leading-normal">
					<th class="px-2 py-1 text-center" scope="col">Character</th>
				</tr>
			</thead>
			<tbody class="text-background-300 text-sm">
				{#each members as member}
					<tr
						class="border-b border-background-700 hover:bg-background-600 transition-colors duration-300"
						on:click={(window.location.href = `/character/${member.character_id}`)}
					>
						<td class="px-2 py-1 text-center">{member.name}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
{/if}
