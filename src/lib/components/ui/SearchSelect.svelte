<script lang="ts">
	import debounce from 'lodash/debounce';
	import { createEventDispatcher } from 'svelte';

	import * as Select from '$lib/components/ui/select';
	import { Input } from '$lib/components/ui/input';

	import { useSearch } from '$lib/models/useSearch';
	const { search } = useSearch();

	const dispatch = createEventDispatcher();

	export let placeholder: string = 'Search...';

	let searchTerm = '';
	let selectedOption = '';

	let searchResults: { id: number; name: string; type: string; ticker: string }[] = [];

	const handleSearch = debounce(async () => {
		if (searchTerm.length > 2) {
			searchResults = await search(searchTerm);
			console.log(searchResults);
		} else {
			searchResults = [];
		}
	}, 300);

	const onSelect = (event: { value: { id: number; type: string } }) => {
		dispatch('selected', { detail: event.value });
	};
</script>

<div>
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
</div>
