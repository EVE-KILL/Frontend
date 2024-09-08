<script lang="ts">
	import { getUpstreamUrl } from '$lib/Config';
	import Characters from '../TopBoxes/Characters.svelte';
	import Corporations from '../TopBoxes/Corporations.svelte';
	import Alliances from '../TopBoxes/Alliances.svelte';
	import Ships from '../TopBoxes/Ships.svelte';
	import Systems from '../TopBoxes/Systems.svelte';
	import Constellations from '../TopBoxes/Constellations.svelte';
	import Regions from '../TopBoxes/Regions.svelte';

	const upstreamUrl = getUpstreamUrl();

	const topCharactersUrl = `${upstreamUrl}/api/stats/topcharacters/20`;
	const topCorporationsUrl = `${upstreamUrl}/api/stats/topcorporations/20`;
	const topAlliancesUrl = `${upstreamUrl}/api/stats/topalliances/20`;
	const topShipsUrl = `${upstreamUrl}/api/stats/topships/20`;
	const topSystemsUrl = `${upstreamUrl}/api/stats/topsolarsystems/20`;
	const topConstellationsUrl = `${upstreamUrl}/api/stats/topconstellations/20`;
	const topRegionsUrl = `${upstreamUrl}/api/stats/topregions/20`;
</script>

<div class="w-full flex-container">
	<div class="flex-item">
		<Characters url={topCharactersUrl} count={20} days={7} />
	</div>
	<div class="flex-item">
		<Corporations url={topCorporationsUrl} count={20} days={7} />
	</div>
	<div class="flex-item">
		<Alliances url={topAlliancesUrl} count={20} days={7} />
	</div>
	<div class="flex-item">
		<Ships url={topShipsUrl} count={20} days={7} />
	</div>
	<div class="flex-item">
		<Systems url={topSystemsUrl} count={20} days={7} />
	</div>
	<div class="flex-item">
		<Constellations url={topConstellationsUrl} count={20} days={7} />
	</div>
	<div class="flex-item">
		<Regions url={topRegionsUrl} count={20} days={7} />
	</div>
</div>

<style>
	.flex-container {
		display: flex;
		flex-wrap: wrap;
	}
	.flex-item {
		flex: 1 1 calc(33.333% - 10px);
		margin: 5px;
	}
</style>
