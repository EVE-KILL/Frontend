<script lang="ts">
	import { getUpstreamUrl } from '$lib/Config';
	import type { Corporation } from '$lib/types/Corporation.ts';
	import Ships from '$lib/components/TopBoxes/Ships.svelte';
	import Systems from '$lib/components/TopBoxes/Systems.svelte';
	import Regions from '$lib/components/TopBoxes/Regions.svelte';
	import Characters from '$lib/components/TopBoxes/Characters.svelte';

	export let corporation: Corporation;
	const upstreamUrl = getUpstreamUrl();
	const top10ShipsUrl = `${upstreamUrl}/api/corporations/${corporation.corporation_id}/top/ships`;
	const top10SystemsUrl = `${upstreamUrl}/api/corporations/${corporation.corporation_id}/top/systems`;
	const top10RegionsUrl = `${upstreamUrl}/api/corporations/${corporation.corporation_id}/top/regions`;
	const top10CharactersUrl = `${upstreamUrl}/api/corporations/${corporation.corporation_id}/top/characters`;
</script>

<div class="container flex p-2 pt-4 gap-2">
	<div class="flex-1 pb-5">
		<Characters url={top10CharactersUrl} />
	</div>
	<div class="flex-1 pb-5">
		<Ships url={top10ShipsUrl} />
	</div>
	<div class="flex-1 pb-5">
		<Systems url={top10SystemsUrl} />
	</div>
	<div class="flex-1 pb-5">
		<Regions url={top10RegionsUrl} />
	</div>
</div>

<style>
	.container {
		display: flex;
		flex-wrap: wrap;
	}
	.flex-1 {
		flex: 1 1 0;
	}
</style>
