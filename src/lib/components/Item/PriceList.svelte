<script lang="ts">
	import moment from 'moment';
	import { onMount } from 'svelte';
	import { getUpstreamUrl } from '$lib/Config';
	import { formatNumber } from '$lib/Helpers.js';
	import { backendFetch } from '$lib/backendFetcher';

	export let item;
	let itemId = item.type_id;
	let prices = [];
	const upstreamUrl = getUpstreamUrl();
	let itemPriceUrl = `${upstreamUrl}/api/items/${itemId}/pricing?regionId=10000002&days=30`;

	onMount(async () => {
		const responsePrice = await backendFetch(itemPriceUrl);
		prices = await responsePrice.json();
	});
</script>

<div class="w-full p-4 rounded bg-opacity-75">
	<h2 class="text-xl font-bold mb-4">Market Prices - The Forge</h2>
	<div>
		<table class="table-auto w-full text-left text-sm bg-semi-transparent rounded-lg shadow-lg">
			<thead>
				<tr class="bg-darker text-white uppercase text-xs leading-normal">
					<th class="px-2 py-1">Date</th>
					<th class="px-2 py-1 text-right">Min Price</th>
					<th class="px-2 py-1 text-right">Avg Price</th>
					<th class="px-2 py-1 text-right">Max Price</th>
				</tr>
			</thead>
			<tbody class="text-background-300 text-sm">
				{#each prices as price}
					<tr class="border-b border-background-700 hover:bg-background-600 transition-colors duration-300">
						<td class="px-2 py-1">{moment(price.date).format('YYYY-MM-DD')}</td>
						<td class="px-2 py-1 text-right">{formatNumber(price.lowest)} ISK</td>
						<td class="px-2 py-1 text-right">{formatNumber(price.average)} ISK</td>
						<td class="px-2 py-1 text-right">{formatNumber(price.highest)} ISK</td>
					</tr>
				{/each}
			</tbody>
		</table>
		<i class="text-background-500 text-xs mt-2 text-left">
			Information pulled from EVERef <a
				href="https://data.everef.net/market-history/"
				target="_blank"
				rel="noopener noreferrer"
				class="text-primary-400">https://data.everef.net/market-history/</a
			>.
		</i>
	</div>
</div>
