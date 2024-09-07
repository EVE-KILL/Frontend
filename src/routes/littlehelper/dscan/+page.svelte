<script lang="ts">
  // State variables
  let pasteText: string = ''; // Store the clipboard text
  let shipCounts: Record<string, number> = {}; // Store ship counts from DScan

  // Function to handle clipboard data for DScan and count ship types
  const handleClipboardData = async () => {
    try {
      // Clear previous state
      shipCounts = {};
      const text = await navigator.clipboard.readText(); // Read clipboard text
      pasteText = text;

      parseDScan(pasteText); // Parse the DScan data
    } catch (err) {
      console.error('Failed to read clipboard: ', err);
    }
  };

  // Function to parse DScan data and count ship types
  const parseDScan = (text: string) => {
    const lines = text.split('\n');
    const shipsMap: Record<string, number> = {}; // Map to store ship counts

    for (const line of lines) {
      // Split by tab or 4 spaces
      let [id, name, shipType] = line.includes('\t') ? line.split('\t') : line.split('    ');

      if (shipType) {
        // Count ship types
        shipsMap[shipType] = (shipsMap[shipType] || 0) + 1;
      }
    }

    shipCounts = shipsMap; // Store ship counts
  };
</script>

<!-- Layout -->
<div class="flex flex-col items-center min-h-screen bg-semi-transparent space-y-4 text-white">
	<p class="text-right text-xs text-gray-400">* Copy the DScan into your pastebuffer, then press the button below</p>
	<div class="bg-semi-transparent shadow-md rounded mt-4">
		<div class="flex justify-center space-x-4">
			<button
				class="px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600"
				on:click={handleClipboardData}
			>
				Paste DScan
			</button>
		</div>
	</div>

	<!-- Ship counts display -->
	{#if Object.keys(shipCounts).length > 0}
		<div class="bg-semi-transparent text-white rounded-lg p-4 w-full max-w-2xl">
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
