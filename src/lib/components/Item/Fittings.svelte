<script lang="ts">
	import { onMount } from 'svelte';
	import { getUpstreamUrl } from '$lib/Config';
	import { backendFetch } from '$lib/backendFetcher';

	export let item;
	let itemId = item.type_id;
	let fittings = [];
	const upstreamUrl = getUpstreamUrl();
	let fittingsUrl = `${upstreamUrl}/api/fitting/${itemId}?limit=10`;

	onMount(async () => {
		const response = await backendFetch(fittingsUrl);
		fittings = await response.json();

		console.log(fittings);
	});

	function generateEveShipFitUrl(killmailId, killmailHash) {
		return `https://eveship.fit/?fit=killmail:${killmailId}/${killmailHash}`;
	}
</script>

{#if !fittings.error}
	<div class="w-full p-4 rounded bg-opacity-75">
		<h2 class="text-xl font-bold mb-4">Top 10 Fittings</h2>
		<div class="grid grid-cols-2 gap-4">
			{#each fittings as fitting, index}
				<div class="border border-background-700 hover:bg-background-600 transition-colors duration-300 p-2">
					<a href={generateEveShipFitUrl(fitting.killmail_id, fitting.killmail_hash)} target="_blank" rel="noopener noreferrer">
						<div>{@html fitting.svg}</div>
					</a>
				</div>
			{/each}
		</div>
	</div>
{/if}
