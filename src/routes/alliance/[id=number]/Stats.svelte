<script lang="ts">
	import { getUpstreamUrl } from '$lib/Config';
	import type { Alliance } from '../../../types/Alliance.ts';
	import Ships from '../../../components/TopBoxes/Ships.svelte';
	import Systems from '../../../components/TopBoxes/Systems.svelte';
	import Regions from '../../../components/TopBoxes/Regions.svelte';
	import Characters from '../../../components/TopBoxes/Characters.svelte';
	import Corporations from '../../../components/TopBoxes/Corporations.svelte';

	export let alliance: Alliance;
	const upstreamUrl = getUpstreamUrl();
	const top10ShipsUrl = `${upstreamUrl}/api/alliances/${alliance.alliance_id}/top/ships`;
	const top10SystemsUrl = `${upstreamUrl}/api/alliances/${alliance.alliance_id}/top/systems`;
	const top10RegionsUrl = `${upstreamUrl}/api/alliances/${alliance.alliance_id}/top/regions`;
	const top10CharactersUrl = `${upstreamUrl}/api/alliances/${alliance.alliance_id}/top/characters`;
	const top10CorporationsUrl = `${upstreamUrl}/api/alliances/${alliance.alliance_id}/top/corporations`;
</script>

<div class="container flex p-2 pt-4 gap-2">
	<div class="flex-1 pb-5">
		<Characters url={top10CharactersUrl} />
	</div>
	<div class="flex-1 pb-5">
		<Corporations url={top10CorporationsUrl} />
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
