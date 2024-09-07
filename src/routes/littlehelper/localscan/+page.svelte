<script lang="ts">
	import { onMount } from 'svelte';
	import pako from 'pako'; // For gzip compression/decompression
	import { replaceState } from '$app/navigation';

	let pasteText = '';
	let namesArray = [];
	let slimmedData = []; // Stores the slimmed data with just corp, alliance, and count
	let corpAllianceMap = {}; // Stores alliance -> corp -> count
	let nonAllianceCorps = {}; // Stores corporations not in any alliance
	let dataFromUrl = false; // Flag to check if data is coming from URL
	let isLoading = false; // Flag to show a loading state

	// On component mount, check for the data parameter and decompress it
	onMount(() => {
		const params = new URLSearchParams(window.location.search);
		const dataParam = params.get('data');

		if (dataParam) {
			try {
				// Mark that the data is from the URL, to skip API calls
				dataFromUrl = true;

				// Enter loading state only if we're processing URL data
				isLoading = true;

				// Try to decompress and parse the data from the URL
				const decompressedData = decompressData(dataParam);
				slimmedData = JSON.parse(decompressedData); // Parse the JSON data
				processSlimmedData(slimmedData); // Process the slimmed data directly

				isLoading = false; // Loading finished
			} catch (err) {
				console.error('Failed to decode or decompress URL data:', err);
				isLoading = false;
			}
		}
	});

	const handleClipboardData = async () => {
		// Enter loading state when the button is clicked to fetch new data
		isLoading = true;

		try {
			corpAllianceMap = {};
			nonAllianceCorps = {};

			const text = await navigator.clipboard.readText(); // Read clipboard text
			pasteText = text;
			namesArray = pasteText.split('\n').filter((name) => name.trim() !== '');

			let dataMap = {};

			// Fetch character data and store only necessary fields
			for (const name of namesArray) {
				const character = await fetchCharacterData(name);
				if (character) {
					const { corporation_name, alliance_name } = character;
					dataMap[name] = { corp: corporation_name, alliance: alliance_name || null };
				}
			}

			// Slim down the data to just corp, alliance, and count
			slimmedData = slimDownData(dataMap);
			processSlimmedData(slimmedData);

			// Store new data in the URL as ?data parameter
			const compressedUrl = generateCompressedUrl(JSON.stringify(slimmedData)); // JSON encode, then gzip + base64url
			replaceState(`${window.location.pathname}?data=${encodeURIComponent(compressedUrl)}`); // Use Svelte's replaceState

			isLoading = false;
		} catch (err) {
			console.error('Failed to read clipboard: ', err);
			isLoading = false;
		}
	};

	const fetchCharacterData = async (name) => {
		try {
			const searchResponse = await fetch(`https://eve-kill.com/api/search/${name}`);
			const searchData = await searchResponse.json();
			const character = searchData.hits.find((hit) => hit.type === 'character');
			if (character) {
				const characterId = character.id;
				const characterInfoResponse = await fetch(
					`https://eve-kill.com/api/characters/${characterId}`
				);
				const characterInfo = await characterInfoResponse.json();
				return characterInfo;
			} else {
				return null; // No character found
			}
		} catch (err) {
			console.error(`Error fetching data for ${name}:`, err);
			return null;
		}
	};

	const slimDownData = (dataMap) => {
		const slimmed = [];

		// Create counts based on the corp and alliance
		const corpAllianceCounter = {};

		for (const key in dataMap) {
			const { corp, alliance } = dataMap[key];
			const keyForCount = `${corp}-${alliance || 'no-alliance'}`;

			if (corpAllianceCounter[keyForCount]) {
				corpAllianceCounter[keyForCount].count += 1;
			} else {
				corpAllianceCounter[keyForCount] = { corp, alliance, count: 1 };
			}
		}

		// Convert the counter map into an array for easy encoding and processing
		for (const key in corpAllianceCounter) {
			slimmed.push(corpAllianceCounter[key]);
		}

		return slimmed;
	};

	const processSlimmedData = (data) => {
		corpAllianceMap = {};
		nonAllianceCorps = {};

		data.forEach((entry) => {
			const { corp, alliance, count } = entry;

			if (!alliance) {
				if (!nonAllianceCorps[corp]) {
					nonAllianceCorps[corp] = count;
				} else {
					nonAllianceCorps[corp] += count;
				}
			} else {
				if (!corpAllianceMap[alliance]) {
					corpAllianceMap[alliance] = { [corp]: count };
				} else {
					if (!corpAllianceMap[alliance][corp]) {
						corpAllianceMap[alliance][corp] = count;
					} else {
						corpAllianceMap[alliance][corp] += count;
					}
				}
			}
		});
	};

	const generateCompressedUrl = (data) => {
		const compressedData = pako.gzip(data); // Compress the slimmed JSON data using gzip
		const base64UrlEncoded = base64urlEncode(compressedData); // Base64URL encode
		return base64UrlEncoded;
	};

	const decompressData = (compressedBase64Url) => {
		const compressedData = base64urlDecode(compressedBase64Url);
		const decompressedData = pako.ungzip(compressedData, { to: 'string' }); // Decompress and return as string
		return decompressedData;
	};

	// Helper function to Base64URL encode data
	const base64urlEncode = (data) => {
		const base64 = btoa(String.fromCharCode(...new Uint8Array(data)));
		return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
	};

	// Helper function to Base64URL decode data
	const base64urlDecode = (base64Url) => {
		const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
		const binaryString = atob(base64);
		const len = binaryString.length;
		const bytes = new Uint8Array(len);
		for (let i = 0; i < len; i++) {
			bytes[i] = binaryString.charCodeAt(i);
		}
		return bytes;
	};

	const getTotalCount = (corporations) => {
		return Object.values(corporations).reduce((acc, count) => acc + count, 0);
	};
</script>

<div class="flex flex-col items-center min-h-screen bg-semi-transparent space-y-4 text-white">
	<p class="text-right text-xs text-gray-400">
		* Copy the list of characters into your paste buffer, then press the button below
	</p>

	{#if isLoading}
		<p>Loading...</p>
	{/if}

	<div class="bg-semi-transparent shadow-md rounded mt-4">
		<div class="flex justify-center space-x-4">
			<button
				class="px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600"
				on:click={handleClipboardData}
			>
				Paste
			</button>
		</div>
	</div>

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
