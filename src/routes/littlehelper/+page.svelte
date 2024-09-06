<script lang="ts">
  import { formatNumber, convertIskToMillions, convertIskToBillions } from '$lib/Helpers';

  // State variables
  let pasteText: string = ''; // Store the clipboard text
  let namesArray: string[] = []; // Store the array of names
  let characterData: any[] = []; // Store the character data as they load
  let selectedDays = "90"; // Default selection for days of stats (90d)

  // Reusable function to get the element with the highest count from an object
  const getTopElementByCount = (items: Record<string, { count: number; name: string }> | undefined) => {
    if (!items) return 'Unknown';
    const itemsArray = Object.values(items);
    const sortedArray = itemsArray.sort((a, b) => b.count - a.count); // Sort by count descending
    return sortedArray.length > 0 ? sortedArray[0].name : 'Unknown'; // Select the top element
  };

  // Helper function to fetch data from the API
  const fetchCharacterData = async (name: string) => {
    try {
      // First API call to search for the character
      const searchResponse = await fetch(`https://eve-kill.com/api/search/${name}`);
      const searchData = await searchResponse.json();

      // Check if we have hits and pick the first character
      if (searchData.hits && searchData.hits.length > 0) {
        const character = searchData.hits[0];
        const characterId = character.id;

        // Second API call to fetch character info
        const characterInfoResponse = await fetch(
          `https://eve-kill.com/api/characters/${characterId}`
        );
        const characterInfo = await characterInfoResponse.json();
        let url = `https://eve-kill.com/api/characters/${characterId}/stats`;
        if (selectedDays !== 'all') {
          url = `https://eve-kill.com/api/characters/${characterId}/stats/${selectedDays}`;
        }

        // Third API call to fetch character stats, appending the selected day range
        const characterStatsResponse = await fetch(url);
        const characterStats = await characterStatsResponse.json();

        // Return the character info and stats
        return {
          name: character.name,
          id: characterId,
          info: characterInfo,
          stats: characterStats
        };
      } else {
        return null; // No character found
      }
    } catch (err) {
      console.error(`Error fetching data for ${name}:`, err);
      return null;
    }
  };

  // Function to handle clipboard data asynchronously for each character
  const handleClipboardData = async () => {
    try {
      // Clear previous state before fetching new data
      characterData = [];
      const text = await navigator.clipboard.readText(); // Read clipboard text
      pasteText = text;
      namesArray = pasteText.split('\n').filter((name) => name.trim() !== ''); // Split by newline

      // Fetch each character data individually and update as they are loaded
      for (const name of namesArray) {
        const character = await fetchCharacterData(name);
        if (character) {
          characterData = [...characterData, character]; // Add character as soon as it's loaded
        }
      }
    } catch (err) {
      console.error('Failed to read clipboard: ', err);
    }
  };

  // Function to calculate kill efficiency and handle cases of NaN
  function killEfficiency(kills: number, losses: number) {
    if (kills + losses === 0) {
      return '0%'; // Handle division by zero
    }
    return `${formatNumber((kills / (kills + losses)) * 100)}%`;
  }

  // Timezone ranges (evening playtimes)
  const timezones = {
    'EUTZ Morning': [7, 12],
    'EUTZ Afternoon': [12, 17],
    'EUTZ Evening': [17, 22],
    'USWTZ Morning': [14, 19],
    'USWTZ Afternoon': [19, 0],
    'USWTZ Evening': [0, 5],
    'USETZ Morning': [11, 16],
    'USETZ Afternoon': [16, 21],
    'USETZ Evening': [21, 2],
    'AUTZ Morning': [21, 2],
    'AUTZ Afternoon': [2, 7],
    'AUTZ Evening': [7, 12],
    'CHTZ Morning': [23, 4],
    'CHTZ Afternoon': [4, 9],
    'CHTZ Evening': [9, 14],
    'RUTZ Morning': [4, 9],
    'RUTZ Afternoon': [9, 14],
    'RUTZ Evening': [14, 19]
  };

  // Function to determine the most active timezone based on the heatmap
  function determineActiveTimezone(heatMap) {
    const hours = Object.entries(heatMap).map(([hour, count]) => ({
      hour: parseInt(hour.replace('h', '')),
      count
    }));
    const sortedHours = hours.sort((a, b) => b.count - a.count); // Sort hours by activity

    const activeHour = sortedHours[0].hour; // Get the most active hour

    // Find the timezone that matches the active hour
    for (const [timezone, [start, end]] of Object.entries(timezones)) {
      if (activeHour >= start && activeHour <= end) {
        return timezone;
      }
      if (start > end && (activeHour >= start || activeHour <= end)) {
        return timezone;
      }
    }
    return 'Unknown'; // Fallback if no timezone is found
  }
</script>
}
<div class="flex flex-col items-center min-h-screen bg-semi-transparent space-y-4 text-white">
	<p class="text-right text-xs text-gray-400">* Copy the channel list into your pastebuffer, then press button below</p>
	<div class="bg-semi-transparent shadow-md rounded mt-4">
		<div class="flex justify-center space-x-4">
			<button
				class="px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600"
				on:click={handleClipboardData}
			>
				Paste and Fetch Data
			</button>

			<!-- Dropdown for selecting the number of days -->
			<select bind:value={selectedDays} class="px-4 py-2 bg-gray-700 text-white rounded">
				<option value="14">14 Days</option>
				<option value="30">30 Days</option>
				<option value="90">90 Days</option>
				<option value="all">All-Time</option>
			</select>
		</div>
	</div>

	<div class="w-full space-y-4">
		{#each characterData as character}
			<div class="shadow-md rounded overflow-hidden bg-gray-900">
				<!-- Flex container for image and details -->
				<div class="flex items-start p-4">
					<!-- Character image (128x128) fixed size -->
					<img
						class="w-40 h-40 rounded-full flex-shrink-0"
						src={`https://images.evetech.net/characters/${character.id}/portrait?size=256`}
						alt="Character Image"
					/>

					<!-- Character name, corporation, alliance -->
					<div class="pl-4">
						<table class="table-auto w-full text-left">
							<tr>
								<td class="font-bold text-right pr-4">Name:</td>
								<td class="text-left">
                                    <a href="/character/{character.id}">{character.name}</a>
                                </td>
							</tr>
							<tr>
								<td class="font-bold text-right pr-4">Corporation:</td>
								<td class="text-left">
                                    <a href="/corporation/{character.info.corporation_id}">
                                        {character.info.corporation_name || 'Unknown'}
                                    </a>
                                </td>
							</tr>
							<tr>
								<td class="font-bold text-right pr-4">Alliance:</td>
								<td class="text-left">
                                    <a href="/alliance/{character.info.alliance_id}">
                                        {character.info.alliance_name || 'Unknown'}
                                    </a>
                                </td>
							</tr>
							<tr>
								<td class="font-bold text-right pr-4">Efficiency:</td>
								<td class="text-left">{killEfficiency(character.stats.kills || 0, character.stats.losses || 0)}</td>
							</tr>
						</table>
					</div>

					<!-- Kills, Losses, Solo Kills -->
					<div class="pl-4">
						<table class="table-auto w-full text-left">
							<tr>
								<td class="font-bold text-right pr-4">Kills:</td>
								<td class="text-left">{character.stats.kills || 0}</td>
							</tr>
							<tr>
								<td class="font-bold text-right pr-4">Losses:</td>
								<td class="text-left">{character.stats.losses || 0}</td>
							</tr>
							<tr>
								<td class="font-bold text-right pr-4">Solo Kills:</td>
								<td class="text-left">{character.stats.soloKills || 0}</td>
							</tr>
							<tr>
								<td class="font-bold text-right pr-4">Solo Losses:</td>
								<td class="text-left">{character.stats.soloLosses || 0}</td>
							</tr>
							<tr>
								<td class="font-bold text-right pr-4">NPC Losses:</td>
								<td class="text-left">{character.stats.npcLosses || 0}</td>
							</tr>
						</table>
					</div>

					<!-- ISK Killed, ISK Lost, Most Used Ship -->
					<div class="pl-4">
						<table class="table-auto w-full text-left">
							<tr>
								<td class="font-bold text-right pr-4">ISK Killed:</td>
								<td class="text-left">{convertIskToBillions(character.stats.iskKilled, 0) || 0}</td>
							</tr>
							<tr>
								<td class="font-bold text-right pr-4">ISK Lost:</td>
								<td class="text-left">{convertIskToBillions(character.stats.iskLost, 0) || 0}</td>
							</tr>
							<tr>
								<td class="font-bold text-right pr-4">Most Used Ship:</td>
								<td class="text-left">{getTopElementByCount(character.stats.mostUsedShips)}</td>
							</tr>
							<tr>
								<td class="font-bold text-right pr-4">Most Flown W/Corp:</td>
								<td class="text-left">{getTopElementByCount(character.stats.fliesWithCorporations)}</td>
							</tr>
							<tr>
								<td class="font-bold text-right pr-4">Most Flown W/Alli:</td>
								<td class="text-left">{getTopElementByCount(character.stats.fliesWithAlliances)}</td>
							</tr>
						</table>
					</div>

					<!-- Other details -->
					<div class="pl-4">
						<table class="table-auto w-full text-left">
							<tr>
								<td class="font-bold text-right pr-4">Cyno Alt:</td>
								<td class="text-left">{character.stats.possibleCynoAlt === true ? 'Yes' : 'No'}</td>
							</tr>
							<tr>
								<td class="font-bold text-right pr-4">FC:</td>
								<td class="text-left">{character.stats.possibleFC === true ? 'Yes' : 'No'}</td>
							</tr>
							<tr>
								<td class="font-bold text-right pr-4">Last Active:</td>
								<td class="text-left">{character.stats.lastActive}</td>
							</tr>
							<tr>
								<td class="font-bold text-right pr-4">TimeZone:</td>
								<td class="text-left">{determineActiveTimezone(character.stats.heatMap)}</td>
							</tr>
						</table>
					</div>
				</div>
			</div>
		{/each}
	</div>
</div>
