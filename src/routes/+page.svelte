<script lang="ts">
	import { getUpstreamUrl } from '$lib/Config';
	import KillList from '../components/KillList.svelte';
	import MostValuableKills from '../components/MostValuableKills.svelte';
	import Characters from '../components/TopBoxes/Characters.svelte';
	import Corporations from '../components/TopBoxes/Corporations.svelte';
	import Alliances from '../components/TopBoxes/Alliances.svelte';
	import Ships from '../components/TopBoxes/Ships.svelte';
	import Systems from '../components/TopBoxes/Systems.svelte';
	import Regions from '../components/TopBoxes/Regions.svelte';
	import { setMeta } from '$lib/Meta.ts';

	const upstreamUrl = getUpstreamUrl();

	const mostValuableKillsUrl = `${upstreamUrl}/api/stats/mostvaluablekills/7/7`;
	const killListUrl = `${upstreamUrl}/api/killlist/latest`;
	const top10CharactersUrl = `${upstreamUrl}/api/stats/topcharacters/10`;
	const top10CorporationsUrl = `${upstreamUrl}/api/stats/topcorporations/10`;
	const top10AlliancesUrl = `${upstreamUrl}/api/stats/topalliances/10`;
	const top10ShipsUrl = `${upstreamUrl}/api/stats/topships/10`;
	const top10SystemsUrl = `${upstreamUrl}/api/stats/topsolarsystems/10`;
	const top10RegionsUrl = `${upstreamUrl}/api/stats/topregions/10`;

    // Set custom meta tags for this page
    setMeta({
        title: `EVE-KILL`,
    });
</script>

<div class="container flex w-full">
	<MostValuableKills url={mostValuableKillsUrl} />
</div>
<div class="container flex p-2 pt-4 gap-2">
	<div class="w-1/4">
		<div class="pb-5">
			<Characters url={top10CharactersUrl} />
		</div>
		<div class="pb-5">
			<Corporations url={top10CorporationsUrl} />
		</div>
		<div class="pb-5">
			<Alliances url={top10AlliancesUrl} />
		</div>
		<div class="pb-5">
			<Ships url={top10ShipsUrl} />
		</div>
		<div class="pb-5">
			<Systems url={top10SystemsUrl} />
		</div>
		<div class="pb-5">
			<Regions url={top10RegionsUrl} />
		</div>
	</div>
	<div class="w-full">
		<KillList url={killListUrl} />
	</div>
</div>
