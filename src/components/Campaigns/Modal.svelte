<script lang="ts">
	import { session } from '$lib/stores/Session';
	import { getUpstreamUrl } from '$lib/Config.ts';
	import { DateInput } from 'date-picker-svelte';

	export let showModal;
	let campaignName = '';
	let campaignDescription = '';
	let selectedType = ''; // Track the selected entity type to show the appropriate descriptions
	let entities = [];
	let locations = [];
	let timePeriods = []; // For tracking date range selections
	const upstreamUrl = getUpstreamUrl();
	let user: any = null;
	// Set the max date to be today + 10 years
	let maxDate = new Date();
	maxDate.setFullYear(maxDate.getFullYear() + 10);

	// Subscribe to the session to get the user data
	$: session.subscribe((value) => {
		user = value.user;
	});

	// Entity types with display names, values, and descriptions
	const entityTypes = [
		{
			name: 'Character',
			value: 'character',
			description: 'Track kills by a specific character.'
		},
		{
			name: 'Corporation',
			value: 'corporation',
			description: 'Track kills by or involving a specific corporation.'
		},
		{
			name: 'Alliance',
			value: 'alliance',
			description: 'Track kills by or involving a specific alliance.'
		},
		{ name: 'Ship ID', value: 'ship_id', description: 'Track kills involving specific ships.' }
	];

	// Treatments for different entity types with display names, values, and descriptions
	const treatments = {
		character: [
			{
				name: 'Friend',
				value: 'friend',
				description:
					'Treat the entity as a friend (focus on kills where this entity is a victim).'
			},
			{
				name: 'Foe',
				value: 'foe',
				description:
					'Treat the entity as a foe (focus on kills where this entity is an attacker).'
			},
			{
				name: 'Solo',
				value: 'is_solo',
				description: 'Limit results to solo kills involving this entity.'
			},
			{
				name: 'NPC Only',
				value: 'is_npc',
				description: 'Limit results to kills where NPCs are involved with this entity.'
			}
		],
		corporation: [
			{
				name: 'Friend',
				value: 'friend',
				description:
					'Treat the entity as a friend (focus on kills where this entity is a victim).'
			},
			{
				name: 'Foe',
				value: 'foe',
				description:
					'Treat the entity as a foe (focus on kills where this entity is an attacker).'
			},
			{
				name: 'Solo',
				value: 'is_solo',
				description: 'Limit results to solo kills involving this entity.'
			},
			{
				name: 'NPC Only',
				value: 'is_npc',
				description: 'Limit results to kills where NPCs are involved with this entity.'
			}
		],
		alliance: [
			{
				name: 'Friend',
				value: 'friend',
				description:
					'Treat the entity as a friend (focus on kills where this entity is a victim).'
			},
			{
				name: 'Foe',
				value: 'foe',
				description:
					'Treat the entity as a foe (focus on kills where this entity is an attacker).'
			},
			{
				name: 'Solo',
				value: 'is_solo',
				description: 'Limit results to solo kills involving this entity.'
			},
			{
				name: 'NPC Only',
				value: 'is_npc',
				description: 'Limit results to kills where NPCs are involved with this entity.'
			}
		],
		ship_id: [
			{
				name: 'Include',
				value: 'include',
				description: 'Include kills that involve this type of ship.'
			},
			{
				name: 'Exclude',
				value: 'exclude',
				description: 'Exclude kills that involve this type of ship.'
			},
			{
				name: 'Solo',
				value: 'is_solo',
				description: 'Limit results to solo kills involving this ship.'
			},
			{
				name: 'NPC Only',
				value: 'is_npc',
				description: 'Limit results to kills where NPCs are involved with this ship.'
			}
		]
	};

	// Add a new entity row
	const addEntity = () => {
		entities = [
			...entities,
			{
				type: '',
				name: '',
				id: '',
				imageUrl: '',
				treatment: '',
				searchResults: [],
				searchTerm: '',
				selectedIndex: -1,
				isDropdownOpen: false
			}
		];
	};

	// Add a new location row
	const addLocation = () => {
		locations = [
			...locations,
			{
				type: '',
				name: '',
				id: '',
				imageUrl: '',
				searchResults: [],
				searchTerm: '',
				selectedIndex: -1,
				isDropdownOpen: false
			}
		];
	};

	// Add a new time period row
	const addTimePeriod = () => {
		if (timePeriods.length === 0) {
			timePeriods = [...timePeriods, { from: null, to: null }];
		}
	};

	// Remove an entity from the list
	const removeEntity = (index: number) => {
		entities = entities.filter((_, i) => i !== index);
	};

	// Remove a location from the list
	const removeLocation = (index: number) => {
		locations = locations.filter((_, i) => i !== index);
	};

	// Remove a time period from the list
	const removeTimePeriod = () => {
		timePeriods = [];
	};

	// Reset the form content
	const resetForm = () => {
		campaignName = '';
		campaignDescription = '';
		entities = [];
		locations = [];
		timePeriods = [];
	};

	// Close the modal and reset form data
	const closeModal = () => {
		resetForm();
		showModal = false;
	};

	// Reactive statement to update form validity
	$: isFormValid =
		campaignName.trim() !== '' && campaignDescription.trim() !== '' && entities.length > 0;

	// Function to search for entities
	async function searchForEntity(index: number) {
		const searchTerm = entities[index].searchTerm;

		if (
			searchTerm.length > 2 &&
			['character', 'corporation', 'alliance', 'ship_id'].includes(entities[index].type)
		) {
			const response = await fetch(`${upstreamUrl}/api/search/${searchTerm}`);
			const results = await response.json();
			const filteredResults = results.hits.filter(
				(result) =>
					result.type ===
					(entities[index].type === 'ship_id' ? 'item' : entities[index].type)
			);

			entities[index].searchResults = filteredResults;
			entities[index].isDropdownOpen = filteredResults.length > 0;
			entities[index].selectedIndex = -1;
		} else {
			entities[index].isDropdownOpen = false;
			entities[index].searchResults = [];
		}
	}

	// Function to search for locations (system/region)
	async function searchForLocation(index: number) {
		const searchTerm = locations[index].searchTerm;

		if (searchTerm.length > 2 && ['system', 'region'].includes(locations[index].type)) {
			const response = await fetch(`${upstreamUrl}/api/search/${searchTerm}`);
			const results = await response.json();
			const filteredResults = results.hits.filter(
				(result) => result.type === locations[index].type
			);

			locations[index].searchResults = filteredResults;
			locations[index].isDropdownOpen = filteredResults.length > 0;
			locations[index].selectedIndex = -1;
		} else {
			locations[index].isDropdownOpen = false;
			locations[index].searchResults = [];
		}
	}

	// Function to handle entity selection from the search results
	const handleEntitySelect = (index: number, selectedEntity: any) => {
		entities[index].name = selectedEntity.name;
		entities[index].id = selectedEntity.id;
		entities[index].searchTerm = selectedEntity.name; // Set the input value to the entity name

		// Set the image URL based on the entity type
		if (selectedEntity.type === 'character') {
			entities[index].imageUrl =
				`https://images.evetech.net/characters/${selectedEntity.id}/portrait?size=64`;
		} else if (selectedEntity.type === 'corporation') {
			entities[index].imageUrl =
				`https://images.evetech.net/corporations/${selectedEntity.id}/logo?size=64`;
		} else if (selectedEntity.type === 'alliance') {
			entities[index].imageUrl =
				`https://images.evetech.net/alliances/${selectedEntity.id}/logo?size=64`;
		} else if (selectedEntity.type === 'item') {
			entities[index].imageUrl =
				`https://images.evetech.net/types/${selectedEntity.id}/icon?size=64`;
		}

		entities[index].isDropdownOpen = false;
	};

	// Function to handle location selection from the search results
	const handleLocationSelect = (index: number, selectedLocation: any) => {
		locations[index].name = selectedLocation.name;
		locations[index].id = selectedLocation.id;
		locations[index].searchTerm = selectedLocation.name; // Set the input value to the location name
		locations[index].imageUrl = `https://eve-kill.com/map.png`; // Use a generic image for locations
		locations[index].isDropdownOpen = false;
	};

	// Function to handle keyboard navigation for the entity search dropdown
	const handleKeydown = (index: number, event: KeyboardEvent) => {
		const resultsLength = entities[index].searchResults.length;

		if (entities[index].isDropdownOpen && resultsLength > 0) {
			if (event.key === 'ArrowDown') {
				event.preventDefault();
				entities[index].selectedIndex = (entities[index].selectedIndex + 1) % resultsLength;
			} else if (event.key === 'ArrowUp') {
				event.preventDefault();
				entities[index].selectedIndex =
					(entities[index].selectedIndex - 1 + resultsLength) % resultsLength;
			} else if (event.key === 'Enter') {
				if (entities[index].selectedIndex >= 0) {
					handleEntitySelect(
						index,
						entities[index].searchResults[entities[index].selectedIndex]
					);
				}
			}
		}
	};

	// Close modal by clicking outside
	const handleOutsideClick = (event) => {
		if (event.target.classList.contains('modal-overlay')) {
			closeModal();
		}
	};

	// Function to handle form submission (send the data to the backend)
	const submitCampaign = async () => {
		if (isFormValid && user) {
			const response = await fetch(`${upstreamUrl}/api/campaigns`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					name: campaignName,
					description: campaignDescription,
					entities: entities.map((entity) => ({
						type: entity.type,
						id: entity.id,
						treatment: entity.treatmentValue
					})),
					locations: locations.map((location) => ({
						type: location.type,
						id: location.id
					})),
					timePeriods,
					user: {
						character_id: user.character_id,
						character_name: user.character_name,
						identifier: user.identifier
					}
				})
			});

			const result = await response.json();
			// If we get a result back and it contains "success: true", we can assume the campaign was created successfully
			if (result.success) {
				closeModal(); // Close modal and reset form
				resetForm();
			} else if (result.error) {
				alert(result.error);
			}
		} else {
			alert('Please fill in all required fields.');
		}
	};
</script>

{#if showModal && user}
	<div
		class="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 modal-overlay"
		on:click={handleOutsideClick}
	>
		<div
			class="bg-gray-800 text-white rounded-lg p-8 w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto relative"
		>
			<!-- Close Button -->
			<button
				class="absolute top-4 right-4 text-gray-400 hover:text-gray-200 text-2xl font-bold"
				on:click={closeModal}>&times;</button
			>

			<h2 class="text-2xl font-semibold mb-6 text-center">New Campaign</h2>

			<!-- Campaign Name -->
			<div class="mb-6">
				<label class="block text-gray-300 mb-2 text-sm">Name</label>
				<input
					type="text"
					bind:value={campaignName}
					class="block w-full border border-gray-600 rounded-lg py-1 px-4 bg-gray-900 text-white"
				/>
			</div>

			<!-- Campaign Description -->
			<div class="mb-6">
				<label class="block text-gray-300 mb-2 text-sm">Description</label>
				<input
					type="text"
					bind:value={campaignDescription}
					class="block w-full border border-gray-600 rounded-lg py-1 px-4 bg-gray-900 text-white"
				/>
			</div>

			<!-- Entities -->
			{#if entities.length > 0}
				<h3 class="font-semibold">Entities</h3>
				<underline class="block w-full h-0.5 bg-gray-600"></underline>
			{/if}
			{#each entities as entity, index}
				<div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-center mb-6 relative">
					<!-- Entity Type -->
					<div>
						<label class="block text-gray-300 mb-2">Type</label>
						<select
							bind:value={entities[index].type}
							class="block w-full border border-gray-600 rounded-lg py-2 px-4 bg-gray-900 text-white"
						>
							{#each entityTypes as entityType}
								<option value={entityType.value}>{entityType.name}</option>
							{/each}
						</select>
					</div>

					<!-- Entity Search or Input -->
					<div class="relative">
						<label class="block text-gray-300 mb-2">Name</label>
						<div
							class="flex items-center border border-gray-600 rounded-lg py-2 px-4 bg-gray-900 text-white"
						>
							{#if entity.imageUrl}
								<img
									src={entity.imageUrl}
									alt={entity.name}
									class="h-8 w-8 mr-2 rounded-md"
								/>
							{/if}
							<input
								type="text"
								bind:value={entities[index].searchTerm}
								on:input={() => searchForEntity(index)}
								on:keydown={(event) => handleKeydown(index, event)}
								class="flex-1 bg-transparent focus:outline-none"
								placeholder="Search for entity..."
							/>
						</div>

						<!-- Search Results Dropdown (for searchable entities) -->
						{#if entities[index].isDropdownOpen}
							<div
								class="absolute bg-gray-800 rounded-lg shadow-lg -mt-1 w-full bottom-full mb-2"
							>
								<ul class="max-h-64 overflow-y-auto">
									{#each entities[index].searchResults as result, resultIndex}
										<li
											class="flex items-center px-4 py-2 text-gray-300 cursor-pointer hover:bg-gray-700 {entities[
												index
											].selectedIndex === resultIndex
												? 'bg-gray-600'
												: ''}"
											on:click={() => handleEntitySelect(index, result)}
										>
											<!-- Image based on type -->
											{#if result.type === 'character'}
												<img
													src={`https://images.evetech.net/characters/${result.id}/portrait?size=64`}
													alt={result.name}
													class="h-8 w-8 mr-2"
												/>
											{:else if result.type === 'corporation'}
												<img
													src={`https://images.evetech.net/corporations/${result.id}/logo?size=64`}
													alt={result.name}
													class="h-8 w-8 mr-2"
												/>
											{:else if result.type === 'alliance'}
												<img
													src={`https://images.evetech.net/alliances/${result.id}/logo?size=64`}
													alt={result.name}
													class="h-8 w-8 mr-2"
												/>
											{:else if result.type === 'item'}
												<img
													src={`https://images.evetech.net/types/${result.id}/icon?size=64`}
													alt={result.name}
													class="h-8 w-8 mr-2"
												/>
											{/if}
											<span>{result.name}</span>
										</li>
									{/each}
								</ul>
							</div>
						{/if}
					</div>

					<!-- Treatment/Modifier -->
					<div>
						<label class="block text-gray-300 mb-2">Treatment</label>
						{#if treatments[entities[index].type] && Array.isArray(treatments[entities[index].type])}
							<select
								bind:value={entities[index].treatmentValue}
								class="block w-full border border-gray-600 rounded-lg py-2 px-4 bg-gray-900 text-white"
							>
								{#each treatments[entities[index].type] as treatment}
									<option value={treatment.value}>{treatment.name}</option>
								{/each}
							</select>
						{:else}
							<p class="text-gray-400">No treatments available for this type.</p>
						{/if}
					</div>

					<!-- Remove Entity Button (X icon) -->
					<button
						class="absolute right-0 top-0 text-red-500 hover:text-red-700 font-bold text-xl"
						on:click={() => removeEntity(index)}>&times;</button
					>
				</div>
			{/each}

			<!-- Locations -->
			{#if locations.length > 0}
				<h3 class="font-semibold">Locations</h3>
				<underline class="block w-full h-0.5 bg-gray-600"></underline>
			{/if}
			{#each locations as location, index}
				<div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-center mb-6 relative">
					<!-- Location Type -->
					<div>
						<label class="block text-gray-300 mb-2">Type</label>
						<select
							bind:value={locations[index].type}
							class="block w-full border border-gray-600 rounded-lg py-2 px-4 bg-gray-900 text-white"
						>
							<option value="system">System</option>
							<option value="region">Region</option>
						</select>
					</div>

					<!-- Location Search -->
					<div class="relative">
						<label class="block text-gray-300 mb-2">Name/Value</label>
						<div
							class="flex items-center border border-gray-600 rounded-lg py-2 px-4 bg-gray-900 text-white"
						>
							{#if location.imageUrl}
								<img
									src={location.imageUrl}
									alt={location.name}
									class="h-8 w-8 mr-2 rounded-md"
								/>
							{/if}
							<input
								type="text"
								bind:value={locations[index].searchTerm}
								on:input={() => searchForLocation(index)}
								class="flex-1 bg-transparent focus:outline-none"
								placeholder="Search for location..."
							/>
						</div>

						<!-- Search Results Dropdown -->
						{#if locations[index].isDropdownOpen}
							<div
								class="absolute bg-gray-800 rounded-lg shadow-lg -mt-1 w-full bottom-full mb-2"
							>
								<ul class="max-h-64 overflow-y-auto">
									{#each locations[index].searchResults as result, resultIndex}
										<li
											class="flex items-center px-4 py-2 text-gray-300 cursor-pointer hover:bg-gray-700 {locations[
												index
											].selectedIndex === resultIndex
												? 'bg-gray-600'
												: ''}"
											on:click={() => handleLocationSelect(index, result)}
										>
											<img
												src={`https://eve-kill.com/map.png`}
												alt={result.name}
												class="h-8 w-8 mr-2"
											/>
											<span>{result.name}</span>
										</li>
									{/each}
								</ul>
							</div>
						{/if}
					</div>

					<!-- Remove Location Button -->
					<button
						class="absolute right-0 top-0 text-red-500 hover:text-red-700 font-bold text-xl"
						on:click={() => removeLocation(index)}>&times;</button
					>
				</div>
			{/each}

			<!-- Time Periods -->
			{#if timePeriods.length > 0}
				<h3 class="font-semibold">Time Period</h3>
				<underline class="block w-full h-0.5 bg-gray-600"></underline>
			{/if}
			{#each timePeriods as timePeriod, index}
				<div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-center mb-6 relative">
					<!-- Date From -->
					<div>
						<label class="block text-gray-300 mb-2">From</label>
						<DateInput
							bind:value={timePeriod.from}
							class="block w-full border border-gray-600 rounded-lg py-2 px-4 bg-gray-900 text-white"
						/>
					</div>

					<!-- Date To -->
					<div>
						<label class="block text-gray-300 mb-2">To</label>
						<DateInput
							bind:value={timePeriod.to}
							max={maxDate}
							class="block w-full border border-gray-600 rounded-lg py-2 px-4 bg-gray-900 text-white"
						/>
					</div>

					<!-- Remove Time Period Button -->
					<button
						class="absolute right-0 top-0 text-red-500 hover:text-red-700 font-bold text-xl"
						on:click={() => removeTimePeriod()}>&times;</button
					>
				</div>
			{/each}

			<!-- Add More Entity Button -->
			<button
				class="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-md shadow-md transition-all mb-6"
				on:click={addEntity}
			>
				Add Entity
			</button>

			<!-- Add More Location Button -->
			<button
				class="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-md shadow-md transition-all mb-6"
				on:click={addLocation}
			>
				Add Location
			</button>

			<!-- Add Time Period Button (only one time period allowed) -->
			{#if timePeriods.length === 0}
				<button
					class="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-md shadow-md transition-all mb-6"
					on:click={addTimePeriod}
				>
					Add Time Period
				</button>
			{/if}

			<!-- Submit Button (disabled if form is not valid) -->
			<button
				class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-md shadow-md transition-all"
				on:click={submitCampaign}
				disabled={!isFormValid}
			>
				Submit
			</button>
            <p class="text-xs text-gray-400 mt-2">* Be aware processing can take a long time, once submitted DO NOT SUBMIT AGAIN!</p>
		</div>
	</div>
{/if}

<style>
	:root {
		--date-picker-background: #2d3748;
		--date-picker-foreground: #e2e8f0;
	}
</style>
