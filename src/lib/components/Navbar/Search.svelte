<script lang="ts">
	import { onMount } from 'svelte';

	import { useSearch } from '$lib/models/useSearch';
	const { search } = useSearch();

	let searchTerm = '';
	let searchResults: string | any[] = [];
	let selectedIndex = -1;
	let isSearchDropdownOpen = false;
	let isSearchBoxFocused = false;

	async function handleSearch(event: { target: { value: string } }) {
		searchTerm = event.target.value;
		if (searchTerm.length > 2) {
			searchResults = await search(searchTerm);
			isSearchDropdownOpen = searchResults.length > 0;
			selectedIndex = -1;
		} else {
			isSearchDropdownOpen = false;
			searchResults = [];
		}
	}

	function closeSearchDropdown() {
		setTimeout(() => {
			isSearchDropdownOpen = false;
		}, 200);
	}

	function handleFocus() {
		isSearchBoxFocused = true;
	}

	function handleBlur() {
		isSearchBoxFocused = false;
	}

	function handleKeydown(event: { altKey: any; metaKey: any; key: string; preventDefault: () => void }) {
		// Check if Alt/Option key is pressed along with 's'
		const isAltOrOption = event.altKey || (navigator.platform.toUpperCase().indexOf('MAC') >= 0 && event.metaKey);

		if (event.key === 's' && isAltOrOption && !isSearchBoxFocused) {
			event.preventDefault();
			document.getElementById('search').focus();
		}

		if (isSearchDropdownOpen) {
			if (event.key === 'ArrowDown') {
				event.preventDefault();
				selectedIndex = (selectedIndex + 1) % searchResults.length;
			} else if (event.key === 'ArrowUp') {
				event.preventDefault();
				selectedIndex = (selectedIndex - 1 + searchResults.length) % searchResults.length;
			} else if (event.key === 'Enter') {
				if (selectedIndex >= 0) {
					window.location.href = `/${searchResults[selectedIndex].type}/${searchResults[selectedIndex].id}`;
				} else if (searchResults.length > 0) {
					window.location.href = `/${searchResults[0].type}/${searchResults[0].id}`;
				}
			}
		}
	}

	onMount(() => {
		document.addEventListener('keydown', handleKeydown);
		return () => {
			document.removeEventListener('keydown', handleKeydown);
		};
	});
</script>

<div class="flex items-center justify-center -mt-1">
	<form class="max-w-full relative">
		<div class="relative">
			<div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
				<svg
					class="w-4 h-4 text-background-500 dark:text-background-400"
					aria-hidden="true"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 20 20"
				>
					<path
						stroke="currentColor"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
					/>
				</svg>
			</div>
			<input
				type="search"
				id="search"
				bind:value={searchTerm}
				on:input={handleSearch}
				on:focus={handleFocus}
				on:blur={handleBlur}
				class="search block w-full pl-10 pr-4 py-2 text-sm text-background-900 border border-background-300 rounded-lg bg-background-50 focus:ring-primary-500 focus:border-primary-500 dark:bg-background-700 dark:border-background-600 dark:placeholder-background-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
				placeholder="Search..."
			/>
		</div>
		{#if isSearchDropdownOpen}
			<div class="absolute bg-background-800 rounded-lg shadow-lg mt-2 w-full">
				<div class="overflow-y-auto max-h-64">
					<table class="table-auto w-full">
						<tbody class="text-background-300 text-sm">
							{#each searchResults as result, index}
								<tr
									class="border-b border-background-700 hover:bg-background-600 transition-colors duration-300 {selectedIndex === index
										? 'bg-background-600'
										: ''}"
									on:click={() => (window.location.href = `/${result.type}/${result.id}`)}
								>
									<td class="h-16 w-16 rounded-md">
										{#if result.type === 'character'}
											<img
												src={`https://images.eve-kill.com/characters/${result.id}/portrait?size=64`}
												alt={result.name}
												class="h-16 w-16 rounded-md"
											/>
										{:else if result.type === 'corporation'}
											<img src={`https://images.eve-kill.com/corporations/${result.id}/logo?size=64`} alt={result.name} class="h-16 w-16 rounded-md" />
										{:else if result.type === 'alliance'}
											<img src={`https://images.eve-kill.com/alliances/${result.id}/logo?size=64`} alt={result.name} class="h-16 w-16 rounded-md" />
										{:else if result.type === 'item'}
											<img
												src={`https://images.eve-kill.com/types/${result.id}/${result.name.includes('Blueprint') ? 'bp' : 'icon'}`}
												alt={result.name}
												class="h-16 w-16 rounded-md"
											/>
										{:else if result.type === 'system' || result.type === 'region'}
											<img src="https://eve-kill.com/map.png" alt={result.name} class="h-16 w-16 rounded-md" />
										{/if}
									</td>
									<td class="px-2 py-2">{result.name}</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>
		{/if}
	</form>
</div>

<style>
	.search {
		min-width: 30rem;
	}
</style>
