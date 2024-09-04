<script lang="ts">
  import { getUpstreamUrl } from '$lib/Config.ts';

  let showModal = false;
  let campaignName = '';
  let campaignDescription = '';
  let selectedType = ''; // Track the selected entity type to show the appropriate descriptions
  let entities = [];
  const upstreamUrl = getUpstreamUrl();

  // Reactive form validation
  let isFormValid = false;

  // Entity types with display names, values, and descriptions
  const entityTypes = [
    { name: 'Character', value: 'character', description: 'Track kills by a specific character.' },
    { name: 'Corporation', value: 'corporation', description: 'Track kills by or involving a specific corporation.' },
    { name: 'Alliance', value: 'alliance', description: 'Track kills by or involving a specific alliance.' },
    { name: 'System', value: 'system', description: 'Track kills that occur in a specific system.' },
    { name: 'Region', value: 'region', description: 'Track kills that occur in a specific region.' },
    { name: 'Ship ID', value: 'ship_id', description: 'Track kills involving specific ships.' }
  ];

  // Treatments for different entity types with display names, values, and descriptions
  const treatments = {
    character: [
      { name: 'Friend', value: 'friend', description: 'Treat the entity as a friend (focus on kills where this entity is a victim).' },
      { name: 'Foe', value: 'foe', description: 'Treat the entity as a foe (focus on kills where this entity is an attacker).' },
      { name: 'Solo', value: 'is_solo', description: 'Limit results to solo kills involving this entity.' },
      { name: 'NPC Only', value: 'is_npc', description: 'Limit results to kills where NPCs are involved with this entity.' }
    ],
    corporation: [
      { name: 'Friend', value: 'friend', description: 'Treat the entity as a friend (focus on kills where this entity is a victim).' },
      { name: 'Foe', value: 'foe', description: 'Treat the entity as a foe (focus on kills where this entity is an attacker).' },
      { name: 'Solo', value: 'is_solo', description: 'Limit results to solo kills involving this entity.' },
      { name: 'NPC Only', value: 'is_npc', description: 'Limit results to kills where NPCs are involved with this entity.' }
    ],
    alliance: [
      { name: 'Friend', value: 'friend', description: 'Treat the entity as a friend (focus on kills where this entity is a victim).' },
      { name: 'Foe', value: 'foe', description: 'Treat the entity as a foe (focus on kills where this entity is an attacker).' },
      { name: 'Solo', value: 'is_solo', description: 'Limit results to solo kills involving this entity.' },
      { name: 'NPC Only', value: 'is_npc', description: 'Limit results to kills where NPCs are involved with this entity.' }
    ],
    system: [
      { name: 'Include', value: 'include', description: 'Include kills that occur within this system.' },
      { name: 'Exclude', value: 'exclude', description: 'Exclude kills that occur within this system.' }
    ],
    region: [
      { name: 'Include', value: 'include', description: 'Include kills that occur within this region.' },
      { name: 'Exclude', value: 'exclude', description: 'Exclude kills that occur within this region.' }
    ],
    ship_id: [
      { name: 'Include', value: 'include', description: 'Include kills that involve this type of ship.' },
      { name: 'Exclude', value: 'exclude', description: 'Exclude kills that involve this type of ship.' },
      { name: 'Solo', value: 'is_solo', description: 'Limit results to solo kills involving this ship.' },
      { name: 'NPC Only', value: 'is_npc', description: 'Limit results to kills where NPCs are involved with this ship.' }
    ]
  };

  // Add a new entity row
  const addEntity = () => {
    entities = [...entities, { type: '', name: '', id: '', imageUrl: '', treatment: '', searchResults: [], searchTerm: '', selectedIndex: -1, isDropdownOpen: false }];
  };

  // Remove an entity from the list
  const removeEntity = (index: number) => {
    entities = entities.filter((_, i) => i !== index);
  };

  // Reactive statement to update form validity
  $: isFormValid = campaignName.trim() !== '' && campaignDescription.trim() !== '' && entities.length > 0;

  // Function to search for entities
  async function searchForEntity(index: number) {
    const searchTerm = entities[index].searchTerm;

    // Only trigger the search if there are more than 2 characters typed
    if (searchTerm.length > 2 && ['character', 'corporation', 'alliance', 'ship_id', 'system', 'region'].includes(entities[index].type)) {
        const response = await fetch(`${upstreamUrl}/api/search/${searchTerm}`);
        const results = await response.json();

        // Filter the results based on the selected entity type
        const filteredResults = results.hits.filter(result => {
        if (entities[index].type === 'ship_id') {
            return result.type === 'item'; // Ship ID is returned as 'item' in API
        } else {
            return result.type === entities[index].type; // Match based on type (character, corporation, etc.)
        }
        });

        // Update the entity's search results and display the dropdown if results exist
        entities[index].searchResults = filteredResults;
        entities[index].isDropdownOpen = filteredResults.length > 0;
        entities[index].selectedIndex = -1;
    } else {
        entities[index].isDropdownOpen = false;
        entities[index].searchResults = [];
    }
  }

  // When an entity is selected from the dropdown
  const handleEntitySelect = (index: number, selectedEntity: any) => {
    entities[index].name = selectedEntity.name;
    entities[index].id = selectedEntity.id;
    entities[index].searchTerm = selectedEntity.name; // Set the input value to the entity name

    // Set the image URL based on the entity type
    if (selectedEntity.type === 'character') {
      entities[index].imageUrl = `https://images.evetech.net/characters/${selectedEntity.id}/portrait?size=64`;
    } else if (selectedEntity.type === 'corporation') {
      entities[index].imageUrl = `https://images.evetech.net/corporations/${selectedEntity.id}/logo?size=64`;
    } else if (selectedEntity.type === 'alliance') {
      entities[index].imageUrl = `https://images.evetech.net/alliances/${selectedEntity.id}/logo?size=64`;
    } else if (selectedEntity.type === 'item') {
      entities[index].imageUrl = `https://images.evetech.net/types/${selectedEntity.id}/icon?size=64`;
    } else if (selectedEntity.type === 'system') {
      entities[index].imageUrl = `https://eve-kill.com/map.png`;
    } else if (selectedEntity.type === 'region') {
      entities[index].imageUrl = `https://eve-kill.com/map.png`;
    }

    entities[index].isDropdownOpen = false;
  };

  // Handle keyboard navigation within the search dropdown
  const handleKeydown = (index: number, event: KeyboardEvent) => {
    const resultsLength = entities[index].searchResults.length;

    // If the dropdown is open and there are results
    if (entities[index].isDropdownOpen && resultsLength > 0) {
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        entities[index].selectedIndex = (entities[index].selectedIndex + 1) % resultsLength;
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        entities[index].selectedIndex = (entities[index].selectedIndex - 1 + resultsLength) % resultsLength;
      } else if (event.key === 'Enter') {
        if (entities[index].selectedIndex >= 0) {
          handleEntitySelect(index, entities[index].searchResults[entities[index].selectedIndex]);
        }
      }
    }
  };

  // Function to handle form submission (send the data to the backend)
  const submitCampaign = async () => {
    if (isFormValid) {
      const response = await fetch(`${upstreamUrl}/api/campaign/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaignName,
          campaignDescription,
          entities: entities.map(entity => ({
            type: entity.type,
            id: entity.id,
            treatment: entity.treatmentValue,
            value: entity.value,
            modifiers: entity.modifiers
          })),
        }),
      });

      const result = await response.json();
      console.log(result);
      showModal = false; // Close modal after submission
    } else {
      // You can add additional UI feedback or alert here if the form is invalid.
      alert('Please fill in all required fields.');
    }
  };
</script>

<div class="mt-4">
  <nav class="bg-semi-transparent text-white py-2 px-4 rounded flex justify-end">
    <button class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-md shadow-md transition-all" on:click={() => (showModal = true)}>
      Create Campaign
    </button>
  </nav>
</div>

{#if showModal}
  <div class="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
    <div class="bg-gray-800 text-white rounded-lg p-8 w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto">
      <h2 class="text-2xl font-semibold mb-6 text-center">New Campaign</h2>

      <!-- Campaign Name -->
      <div class="mb-6">
        <label class="block text-gray-300 mb-2">Name</label>
        <input type="text" bind:value={campaignName} class="block w-full border border-gray-600 rounded-lg py-2 px-4 bg-gray-900 text-white" />
      </div>

      <!-- Campaign Description -->
      <div class="mb-6">
        <label class="block text-gray-300 mb-2">Description</label>
        <textarea bind:value={campaignDescription} class="block w-full border border-gray-600 rounded-lg py-2 px-4 bg-gray-900 text-white" rows="3"></textarea>
      </div>

      <!-- Show descriptions only when an entity type is selected -->
      {#if selectedType !== ''}
        <div class="mb-6 p-4 bg-gray-700 text-gray-300 rounded-lg">
          <h3 class="text-xl mb-3 font-semibold">Entity Type: {entityTypes.find(e => e.value === selectedType)?.name}</h3>
          <p>{entityTypes.find(e => e.value === selectedType)?.description}</p>

          <h4 class="text-lg mt-3 mb-2">Available Treatments:</h4>
          <ul class="list-disc list-inside">
            {#each treatments[selectedType] as treatment}
              <li>{treatment.name}: {treatment.description}</li>
            {/each}
          </ul>
        </div>
      {/if}

      <!-- Entities -->
      {#each entities as entity, index}
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-center mb-6 relative">
          <!-- Entity Type -->
          <div>
            <label class="block text-gray-300 mb-2">Type</label>
            <select bind:value={entities[index].type} class="block w-full border border-gray-600 rounded-lg py-2 px-4 bg-gray-900 text-white" on:change={() => selectedType = entities[index].type}>
              {#each entityTypes as entityType}
                <option value={entityType.value}>{entityType.name}</option>
              {/each}
            </select>
          </div>

          <!-- Entity Search or Input -->
          <div class="relative">
            <label class="block text-gray-300 mb-2">Name/Value</label>
            {#if entity.type === 'total_value'}
              <!-- total_value input -->
              <div class="flex items-center">
                <select bind:value={entity.treatmentValue} class="border border-gray-600 rounded-lg py-2 px-2 bg-gray-900 text-white mr-2">
                  {#each treatments.total_value as treatment}
                    <option value={treatment.value}>{treatment.name}</option>
                  {/each}
                </select>
                <input type="number" bind:value={entity.value} placeholder="ISK Value" class="flex-1 border border-gray-600 rounded-lg py-2 px-4 bg-gray-900 text-white"/>
              </div>
            {:else}
              <!-- Searchable entity input (character, corp, alliance, ship_id) -->
              <div class="flex items-center border border-gray-600 rounded-lg py-2 px-4 bg-gray-900 text-white">
                <!-- Image next to the input (if selected) -->
                {#if entity.imageUrl}
                  <img src={entity.imageUrl} alt={entity.name} class="h-8 w-8 mr-2 rounded-md"/>
                {/if}
                <input type="text" bind:value={entities[index].searchTerm} on:input={() => searchForEntity(index)} on:keydown={(event) => handleKeydown(index, event)} class="flex-1 bg-transparent focus:outline-none" placeholder="Search for entity..." />
              </div>
            {/if}

            <!-- Search Results Dropdown (for searchable entities) -->
            {#if entities[index].isDropdownOpen && treatments[entities[index].type]}
              {#if treatments[entities[index].type] && Array.isArray(treatments[entities[index].type])}
                <div class="absolute bg-gray-800 rounded-lg shadow-lg -mt-1 w-full bottom-full mb-2">
                  <ul class="max-h-64 overflow-y-auto">
                    {#each entities[index].searchResults as result, resultIndex}
                      <li class="flex items-center px-4 py-2 text-gray-300 cursor-pointer hover:bg-gray-700 {entities[index].selectedIndex === resultIndex ? 'bg-gray-600' : ''}" on:click={() => handleEntitySelect(index, result)}>
                        <!-- Image based on type -->
                        {#if result.type === 'character'}
                          <img src={`https://images.evetech.net/characters/${result.id}/portrait?size=64`} alt={result.name} class="h-8 w-8 mr-2"/>
                        {:else if result.type === 'corporation'}
                          <img src={`https://images.evetech.net/corporations/${result.id}/logo?size=64`} alt={result.name} class="h-8 w-8 mr-2"/>
                        {:else if result.type === 'alliance'}
                          <img src={`https://images.evetech.net/alliances/${result.id}/logo?size=64`} alt={result.name} class="h-8 w-8 mr-2"/>
                        {:else if result.type === 'system'}
                          <img src={`https://eve-kill.com/map.png`} alt={result.name} class="h-8 w-8 mr-2"/>
                        {:else if result.type === 'region'}
                          <img src={`https://eve-kill.com/map.png`} alt={result.name} class="h-8 w-8 mr-2"/>
                        {:else if result.type === 'item'}
                          <img src={`https://images.evetech.net/types/${result.id}/icon?size=64`} alt={result.name} class="h-8 w-8 mr-2"/>
                        {/if}
                        <span>{result.name}</span>
                      </li>
                    {/each}
                  </ul>
                </div>
              {/if}
            {/if}
          </div>

          <!-- Treatment/Modifier -->
          <div>
            <label class="block text-gray-300 mb-2">Treatment</label>
            {#if treatments[entities[index].type]}
              <select bind:value={entities[index].treatmentValue} class="block w-full border border-gray-600 rounded-lg py-2 px-4 bg-gray-900 text-white">
                {#each treatments[entities[index].type] as treatment}
                  <option value={treatment.value}>{treatment.name}</option>
                {/each}
              </select>
            {/if}
          </div>

          <!-- Remove Entity Button (X icon) -->
          <button class="absolute right-0 top-0 text-red-500 hover:text-red-700 font-bold text-xl" on:click={() => removeEntity(index)}>&times;</button>
        </div>
      {/each}

      <!-- Add More Entity Button -->
      <button class="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-md shadow-md transition-all mb-6" on:click={addEntity}>
        Add Entity
      </button>

      <!-- Submit Button (disabled if form is not valid) -->
      <button class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-md shadow-md transition-all" on:click={submitCampaign} disabled={!isFormValid}>
        Submit
      </button>
    </div>
  </div>
{/if}
