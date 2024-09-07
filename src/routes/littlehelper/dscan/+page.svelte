<script lang="ts">
	import { onMount } from 'svelte';
	import pako from 'pako'; // Import pako for gzip compression/decompression

	let pasteText: string = ''; // Store the clipboard text
	let shipCounts: Record<string, number> = {}; // Store ship counts from DScan

	// On component mount, check for the dscan parameter and decompress it
	onMount(() => {
		const params = new URLSearchParams(window.location.search);
		const dscanParam = params.get('dscan');

		if (dscanParam) {
			// If we have a dscan param, decompress and parse it
			const decompressedText = decompressDscan(dscanParam);
			parseDScan(decompressedText); // Parse the decompressed DScan
		}
	});

	// Function to handle clipboard data, compress it, and update the URL
	const handleClipboardData = async () => {
		try {
			shipCounts = {}; // Clear previous state
			const text = await navigator.clipboard.readText(); // Read clipboard text
			pasteText = text;

			parseDScan(pasteText); // Parse the DScan data
			const compressedUrl = generateCompressedUrl(pasteText); // Generate the compressed URL
			window.history.replaceState(null, '', compressedUrl); // Update the URL without reloading
		} catch (err) {
			console.error('Failed to read clipboard: ', err);
		}
	};

	// Function to parse DScan data and count ship types
	const parseDScan = (text: string) => {
		const lines = text.split('\n');
		const shipsMap: Record<string, number> = {};

		for (const line of lines) {
			let [id, name, shipType] = line.includes('\t') ? line.split('\t') : line.split('    ');
			if (shipType) {
				shipsMap[shipType] = (shipsMap[shipType] || 0) + 1; // Count ship types
			}
		}

		shipCounts = shipsMap; // Store ship counts
	};

	// Function to compress the DScan using gzip and encode in base64
	const generateCompressedUrl = (data: string) => {
		const compressedData = pako.gzip(data); // Compress the text using gzip
		const base64Encoded = btoa(String.fromCharCode.apply(null, new Uint8Array(compressedData))); // Convert compressed data to base64
		return `${window.location.pathname}?dscan=${encodeURIComponent(base64Encoded)}`; // Return the new URL with the compressed dscan
	};

	// Function to decompress the base64 dscan parameter
	const decompressDscan = (compressedBase64: string): string => {
		const compressedData = Uint8Array.from(atob(compressedBase64), (c) => c.charCodeAt(0)); // Decode base64 to Uint8Array
		const decompressedData = pako.ungzip(compressedData, { to: 'string' }); // Decompress using pako
		return decompressedData;
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
			>
				Parse DScan
			</button>
		</div>
	</div>

	<!-- Ship counts display -->
	{#if Object.keys(shipCounts).length > 0}
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
