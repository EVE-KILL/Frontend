<script lang="ts">
	import { onMount } from 'svelte';
	import { replaceState } from '$app/navigation';
	import { getUpstreamUrl } from '$lib/Config';

	let pasteText = '';
	let namesArray = [];
	let corpAllianceMap = {}; // Stores alliance -> corp -> count
	let nonAllianceCorps = {}; // Stores corporations not in any alliance
	let dataFromUrl = false; // Flag to check if data is coming from URL
	let isLoading = false; // Flag to show a loading state
	let upstreamUrl = getUpstreamUrl();

	// On component mount, check for the hash parameter and fetch data
	onMount(() => {
		const params = new URLSearchParams(window.location.search);
		const hashParam = params.get('hash');

		if (hashParam) {
			try {
				// Mark that the data is from the URL, to skip API calls
				dataFromUrl = true;
				isLoading = true;
				fetchDataByHash(hashParam);
			} catch (err) {
				console.error('Failed to fetch data by hash:', err);
				isLoading = false;
			}
		}
	});

	const handleClipboardData = async () => {
		isLoading = true;

		try {
			const text = await navigator.clipboard.readText(); // Read clipboard text
			pasteText = text;
			namesArray = pasteText.split('\n').filter((name) => name.trim() !== '');

			// Send the names array to the API
			const response = await fetch(`${upstreamUrl}/api/lilhelper/localscan`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ names: namesArray })
			});

			const result = await response.json();
			const { hash, alliances, corporations } = result;

			// Process the returned data
			processApiData(corporations, alliances);

			// Store the hash in the URL
			replaceState(`${window.location.pathname}?hash=${hash}`);

			isLoading = false;
		} catch (err) {
			console.error('Failed to read clipboard or process API:', err);
			isLoading = false;
		}
	};

	const fetchDataByHash = async (hash) => {
		try {
			const response = await fetch(`https://eve-kill.com/api/lilhelper/localscan/${hash}`);
			const result = await response.json();
			const { alliances, corporations } = result;

			// Process the returned data
			processApiData(corporations, alliances);

			isLoading = false;
		} catch (err) {
			console.error('Error fetching data by hash:', err);
			isLoading = false;
		}
	};

	const processApiData = (corporations, alliances) => {
		corpAllianceMap = {};
		nonAllianceCorps = {};

		// Process corporations not in alliances
		for (const [corpId, corpName] of Object.entries(corporations)) {
			nonAllianceCorps[corpName] = 1;
		}

		// Process alliances and their corporations
		for (const [allianceId, allianceData] of Object.entries(alliances)) {
			const { name: allianceName, corporations: allianceCorps } = allianceData;

			corpAllianceMap[allianceName] = {};
			allianceCorps.forEach((corp) => {
				corpAllianceMap[allianceName][corp] = 1;
			});
		}
	};

	const getTotalCount = (corporations) => {
		return Object.values(corporations).reduce((acc, count) => acc + count, 0);
	};
</script>

<div class="flex flex-col items-center min-h-screen bg-semi-transparent space-y-4 text-white">
	<p class="text-right text-xs text-gray-400">
		* Copy the list of characters into your paste buffer, then press the button below
	</p>

	<!-- Always show the button -->
	<div class="bg-semi-transparent shadow-md rounded mt-4">
		<div class="flex justify-center space-x-4">
			<button
				class="px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600"
				on:click={handleClipboardData}
				disabled={isLoading}
			>
				Paste
			</button>
		</div>
	</div>

	{#if isLoading}
		<p>Loading...</p>
	{/if}

	<!-- Alliance and Corporation table display -->
	{#if Object.keys(corpAllianceMap).length > 0 || Object.keys(nonAllianceCorps).length > 0}
		<div class="bg-semi-transparent text-white rounded-lg p-4 w-2/3 max-w-lg mx-auto">
			<h3 class="text-lg font-bold mb-2 text-center">Alliance / Corporation Breakdown</h3>
			<table class="table-auto w-full text-sm">
				<tbody>
					{#each Object.entries(corpAllianceMap) as [alliance, corporations]}
						<tr>
							<td class="font-bold align-top"
								>{alliance} ({getTotalCount(corporations)})</td
							>
							<td colspan="2"></td>
						</tr>
						{#each Object.entries(corporations) as [corp, count]}
							<tr>
								<td class="pl-8 text-gray-400">{corp}</td>
								<td class="text-right">{count}</td>
							</tr>
						{/each}
					{/each}

					{#if Object.keys(nonAllianceCorps).length > 0}
						<tr>
							<td colspan="3" class="py-2"></td>
						</tr>
						<tr>
							<td colspan="3" class="font-bold text-center text-yellow-500"
								>Corporations Without Alliance</td
							>
						</tr>
					{/if}

					{#each Object.entries(nonAllianceCorps) as [corp, count]}
						<tr>
							<td class="pl-8 text-gray-400">{corp}</td>
							<td class="text-right">{count}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</div>

<style>
	table {
		border-spacing: 0 10px;
	}
</style>
