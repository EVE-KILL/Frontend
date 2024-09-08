<script lang="ts">
	import { getUpstreamUrl } from '$lib/Config';
	import { onMount } from 'svelte';
	import { replaceState } from '$app/navigation';

	let pasteText = ''; // Store the clipboard text
	let shipCounts: Record<string, number> = {}; // Store ship names and counts
	let isLoading = false;
	let upstreamUrl = getUpstreamUrl();

	// On component mount, check for the hash parameter and fetch data by hash
	onMount(() => {
		const params = new URLSearchParams(window.location.search);
		const hashParam = params.get('hash');

		if (hashParam) {
			isLoading = true;
			fetchDataByHash(hashParam);
		}
	});

	// Function to handle clipboard data, send it to the API, and update the URL
	const handleClipboardData = async () => {
		try {
			isLoading = true;
			shipCounts = {}; // Clear previous state
			const text = await navigator.clipboard.readText(); // Read clipboard text
			pasteText = text;

			// Extract ship names from DScan (you can still do this to clean up the input)
			const shipNames = parseDScan(pasteText);

			// Send the ship names to the API
			const response = await fetch(`${upstreamUrl}/api/lilhelper/dscan`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ dscan: pasteText })
			});

			const result = await response.json();
			const { ships, hash } = result;

			// Process the ship counts from the API
			shipCounts = ships;

			// Store the hash in the URL
			replaceState(`${window.location.pathname}?hash=${hash}`);
			isLoading = false;
		} catch (err) {
			console.error('Failed to process DScan:', err);
			isLoading = false;
		}
	};

	// Fetch data by hash using the GET API
	const fetchDataByHash = async (hash: string) => {
		try {
			const response = await fetch(`${upstreamUrl}/api/lilhelper/dscan/${hash}`);
			const result = await response.json();
			const { ships } = result;

			// Process the ship counts from the result
			shipCounts = ships;

			isLoading = false;
		} catch (err) {
			console.error('Error fetching data by hash:', err);
			isLoading = false;
		}
	};

	// Function to parse DScan data and extract only ship names
	const parseDScan = (text: string) => {
		const lines = text.split('\n');
		const shipNames: string[] = [];

		for (const line of lines) {
			const fields = line.includes('\t') ? line.split('\t') : line.split('    '); // Split by tab or spaces
			const shipType = fields[2]; // Ship name is in the 3rd position

			if (shipType) {
				shipNames.push(shipType); // Add the ship name to the array
			}
		}

		return shipNames; // Return the array of ship names
	};
</script>

<!-- Layout -->
<div class="flex flex-col items-center min-h-screen bg-semi-transparent space-y-4 text-white">
	<p class="text-right text-xs text-gray-400">
		* Copy the DScan into your pastebuffer, then press the button below
	</p>
	<div class="bg-semi-transparent shadow-md rounded mt-4">
		<div class="flex justify-center space-x-4">
			<button
				class="px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600"
				on:click={handleClipboardData}
				disabled={isLoading}
			>
				Parse DScan
			</button>
		</div>
	</div>

	{#if isLoading}
		<p>Loading...</p>
	{/if}

	<!-- Ship counts display -->
	{#if Object.keys(shipCounts).length > 0 && !isLoading}
		<div class="bg-gray-900 text-white rounded-lg p-4 w-full max-w-2xl">
			<h3 class="text-lg font-bold mb-2">Ship Counts</h3>
			<table class="table-auto w-full">
				<thead>
					<tr>
						<th class="text-left">Ship Type</th>
						<th class="text-right">Count</th>
					</tr>
				</thead>
				<tbody>
					{#each Object.entries(shipCounts) as [ship, count]}
						<tr>
							<td>{ship}</td>
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
