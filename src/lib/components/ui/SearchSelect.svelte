<script lang="ts">
	import debounce from 'lodash/debounce';
	import { createEventDispatcher, onMount } from 'svelte';

	import * as Select from '$lib/components/ui/select';
	import { Input } from '$lib/components/ui/input';

	import { useSearch } from '$lib/models/useSearch';
	const { search, searchLocations } = useSearch();

	const dispatch = createEventDispatcher();

	export let placeholder: string = 'Search...';
	export let value: { id?: number; name?: string; type?: string };
	export let type: string = 'entity';

	let searchTerm = '';
	let selectedOption: { value: { id?: number; name?: string; type?: string }; label?: string };

	let searchResults: { id?: number; name?: string; type?: string; ticker?: string }[] = [];

	const handleSearch = debounce(async () => {
		if (searchTerm.length > 2) {
			if (type === 'entity') {
				searchResults = await search(searchTerm);
			} else {
				searchResults = await searchLocations(searchTerm);
			}
		} else {
			searchResults = [];
		}
	}, 300);

	const onSelect = (event: { value: { id?: number; type?: string } } | undefined) => {
		dispatch('selected', event?.value);
	};

	onMount(() => {
		if (value) {
			selectedOption = { value, label: value.name };
		} else if (type === 'location') {
			selectedOption = { value: null, label: 'Anywhere' };
		}
	});
</script>

<Select.Root selected={selectedOption} onSelectedChange={onSelect}>
	<Select.Trigger class="w-[180px]">
		<Select.Value {placeholder} />
	</Select.Trigger>
	<Select.Content class="bg-background-900 text-background-50">
		<Input
			bind:value={searchTerm}
			on:input={handleSearch}
			placeholder="Search..."
			class="bg-background-700 text-background-50 placeholder-background-50"
		/>
		{#if type === 'location'}
			<Select.Item value={null} class="cursor-pointer">Anywhere</Select.Item>
		{/if}
		{#if searchResults.length > 0}
			<div class="overflow-y-auto max-h-40 mt-1">
				{#each searchResults as result}
					<Select.Item value={result} class="cursor-pointer">{result.name}</Select.Item>
				{/each}
			</div>
		{:else}
			<div class="text-xs mt-2">Search for entities</div>
		{/if}
	</Select.Content>
</Select.Root>
