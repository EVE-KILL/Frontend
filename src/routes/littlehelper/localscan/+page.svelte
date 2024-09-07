<script lang="ts">
  import { onMount } from 'svelte';
  import pako from 'pako'; // Import pako for gzip compression/decompression
  import { replaceState } from '$app/navigation'; // Import Svelte's replaceState function

  let pasteText: string = ''; // Store the clipboard text
  let namesArray: string[] = []; // Store the array of names
  let characterData: any[] = []; // Store the character data
  let corpAllianceMap: Record<string, Record<string, number>> = {}; // Stores alliance -> corp -> count
  let nonAllianceCorps: Record<string, number> = {}; // Stores corporations not in any alliance

  // On component mount, check for the data parameter and decompress it
  onMount(() => {
    const params = new URLSearchParams(window.location.search);
    const dataParam = params.get('data');

    if (dataParam) {
      // If we have a data param, decompress and parse it
      const decompressedData = decompressData(dataParam);
      characterData = JSON.parse(decompressedData); // Use the decompressed character data
      processCharacterData(characterData); // Process the data directly
    }
  });

  // Function to handle clipboard data, fetch character data, compress it, and update the URL
  const handleClipboardData = async () => {
    try {
      corpAllianceMap = {};
      nonAllianceCorps = {};
      const text = await navigator.clipboard.readText(); // Read clipboard text
      pasteText = text;
      namesArray = pasteText.split('\n').filter((name) => name.trim() !== '');

      characterData = []; // Reset the character data array
      // Fetch character data from API
      for (const name of namesArray) {
        const character = await fetchCharacterData(name);
        if (character) {
          characterData.push(character);
        }
      }

      // Process the fetched character data
      processCharacterData(characterData);

      // Compress and store the character data in the URL
      const compressedUrl = generateCompressedUrl(JSON.stringify(characterData));
      replaceState(compressedUrl); // Update the URL without reloading using Svelte's replaceState
    } catch (err) {
      console.error('Failed to read clipboard: ', err);
    }
  };

  // Helper function to fetch data from the API
  const fetchCharacterData = async (name: string) => {
    try {
      const searchResponse = await fetch(`https://eve-kill.com/api/search/${name}`);
      const searchData = await searchResponse.json();
      const character = searchData.hits.find(hit => hit.type === 'character');
      if (character) {
        const characterId = character.id;
        const characterInfoResponse = await fetch(`https://eve-kill.com/api/characters/${characterId}`);
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

  // Function to process and organize the character data
  const processCharacterData = (data: any[]) => {
    corpAllianceMap = {};
    nonAllianceCorps = {};

    data.forEach(character => {
      const { corporation_name, alliance_name } = character;

      if (!alliance_name) {
        if (!nonAllianceCorps[corporation_name]) {
          nonAllianceCorps[corporation_name] = 1;
        } else {
          nonAllianceCorps[corporation_name] += 1;
        }
      } else {
        if (!corpAllianceMap[alliance_name]) {
          corpAllianceMap[alliance_name] = { [corporation_name]: 1 };
        } else {
          if (!corpAllianceMap[alliance_name][corporation_name]) {
            corpAllianceMap[alliance_name][corporation_name] = 1;
          } else {
            corpAllianceMap[alliance_name][corporation_name] += 1;
          }
        }
      }
    });
  };

  // Function to compress the character data and encode it in base64
  const generateCompressedUrl = (data: string) => {
    const compressedData = pako.gzip(data); // Compress the JSON data
    const base64Encoded = btoa(String.fromCharCode(...new Uint8Array(compressedData))); // Base64 encode
    return `${window.location.pathname}?data=${encodeURIComponent(base64Encoded)}`; // Return the new URL
  };

  // Function to decompress the base64 encoded character data from the URL
  const decompressData = (compressedBase64: string): string => {
    const compressedData = Uint8Array.from(atob(compressedBase64), c => c.charCodeAt(0)); // Decode base64
    const decompressedData = pako.ungzip(compressedData, { to: 'string' }); // Decompress using pako
    return decompressedData;
  };

  // Helper function to calculate the total count for each alliance
  const getTotalCount = (corporations: Record<string, number>) => {
    return Object.values(corporations).reduce((acc, count) => acc + count, 0);
  };
</script>

<div class="flex flex-col items-center min-h-screen bg-semi-transparent space-y-4 text-white">
  <p class="text-right text-xs text-gray-400">* Copy the list of characters into your paste buffer, then press the button below</p>
  <div class="bg-semi-transparent shadow-md rounded mt-4">
    <div class="flex justify-center space-x-4">
      <button
        class="px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600"
        on:click={handleClipboardData}
      >
        Paste and Fetch Data
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
              <td class="font-bold align-top">{alliance} ({getTotalCount(corporations)})</td>
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
              <td colspan="3" class="font-bold text-center text-yellow-500">Corporations Without Alliance</td>
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
