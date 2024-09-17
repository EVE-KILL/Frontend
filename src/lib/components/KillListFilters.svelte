<script lang="ts">
	import { get } from 'svelte/store';
	import type { KillmailFilters } from '$lib/types/KillmailFilters';

	import { Checkbox } from '$lib/components/ui/checkbox';
	import SearchSelect from '$lib/components/ui/SearchSelect.svelte';
	import { Input } from '$lib/components/ui/input';
	import * as Select from '$lib/components/ui/select';

	import { killmailFilters } from '$lib/stores/killmails';
	import { useKillmails } from '$lib/models/useKillmails';
	const { setFilters } = useKillmails();

	interface InvolvedEntityEntry {
		entity: { id?: number; name?: string; type?: string };
		involvedAs: string;
	}

	const involvedAsOptions = [
		{ value: 'victim', label: 'Victim' },
		{ value: 'attacker', label: 'Attacker' },
		{ value: 'both', label: 'Victim or Attacker' }
	];

	const filters: KillmailFilters = get(killmailFilters);
	let localInvolvedEntities: InvolvedEntityEntry[] = filters.involved_entities?.map((entity) => {
		return {
			entity: {
				id: entity.entity_id,
				name: entity.entity_name,
				type: entity.entity_type
			},
			involvedAs: entity.involved_as
		};
	});

	const setNewFilters = () => {
		// we want to compile all the filters into a single object
		// and then pass that object to the setFilters function
		console.log('filters changed', filters);

		// we want to filter out invalid entity entries
		let validEntities = localInvolvedEntities.filter((entity) => entity.entity.id && entity.entity.name && entity.entity.type);

		// we need to format the involved entities back into the format the filters expects
		const newFilters = {
			...filters,
			involved_entities: validEntities?.map((entity) => {
				return {
					entity_id: entity.entity.id,
					entity_name: entity.entity.name,
					entity_type: entity.entity.type,
					involved_as: entity.involvedAs
				};
			})
		};

		setFilters(newFilters);
	};

	const onSelectEntity = (entityEntry: InvolvedEntityEntry, value: any) => {
		console.log('onSelect', type, entityEntry, value);
		entityEntry.entity = value.detail;
		setNewFilters();
	};

	const onSelectInvolvedAs = (entityEntry: InvolvedEntityEntry, value: any) => {
		entityEntry.involvedAs = value;
		setNewFilters();
	};

	const onSelectLocation = (value: CustomEvent) => {
		console.log('onSelectLocation', value);
		if (value.detail === null) {
			filters.region_id = undefined;
			filters.system_id = undefined;
		} else if (value.detail.type === 'region') {
			filters.region_id = value.detail.id;
		} else if (value.detail.type === 'system') {
			filters.system_id = value.detail.id;
		}

		setNewFilters();
	};

	const onAddEntity = () => {
		localInvolvedEntities = [
			...localInvolvedEntities,
			{
				entity: { id: undefined, name: undefined, type: undefined },
				involvedAs: 'both'
			}
		];

		setNewFilters();
	};

	const onRemoveEntity = (entityEntry: InvolvedEntityEntry) => {
		localInvolvedEntities = localInvolvedEntities.filter((entry) => entry !== entityEntry);
		setNewFilters();
	};
</script>

<div class="flex flex-wrap gap-2 items-start bg-semi-transparent px-2 py-2 mb-4 w-full">
	<div class="flex flex-col items-center border-2 border-background-800 px-2 py-1 bg-semi-transparent">
		<div>Misc Filters</div>
		<div class="flex flex-col gap-1">
			<!-- Checkbox for kills -->
			<!-- <div class="flex items-center gap-1">
				<Checkbox bind:checked={filters.misc.kills} onCheckedChange={onFilterChange} />
				<div class="text-sm">Kills</div>
			</div> -->
			<!-- Checkbox for losses -->
			<!-- <div class="flex items-center gap-1">
				<Checkbox bind:checked={filters.misc.losses} onCheckedChange={onFilterChange} />
				<div class="text-sm">Losses</div>
			</div> -->
			<!-- checkbox for NPC kills -->
			<!-- <div class="flex items-center gap-1">
				<Checkbox bind:checked={filters.misc.npc} onCheckedChange={onFilterChange} />
				<div class="text-sm">NPC Kills</div>
			</div> -->
			<!-- checkbox for solo kills -->
			<!-- <div class="flex items-center gap-1">
				<Checkbox bind:checked={filters.misc.solo} onCheckedChange={onFilterChange} />
				<div class="text-sm">Solo Kills</div>
			</div> -->
			<!-- checkbox for 'entity you are looking at got the final blow' -->
		</div>
	</div>

	<!-- Involved Entity Filters -->
	<div class="flex flex-col border-2 border-background-800 px-2 py-1 bg-semi-transparent">
		<div class="flex">
			<div>Involved Entity Filters</div>
			<div class="flex-grow" />
			<button class="text-xs" on:click={onAddEntity}>Add Entry</button>
		</div>
		<div class="flex flex-col gap-2">
			{#if localInvolvedEntities}
				{#each localInvolvedEntities as entityEntry}
					{#key entityEntry.entity.id}
						<div class="flex gap-2">
							<!-- Entity Search Select -->
							<SearchSelect
								on:selected={(value) => onSelectEntity(entityEntry, value)}
								value={entityEntry.entity}
								placeholder="Involved Entity..."
								type="entity"
							/>

							<!-- select for involved as -->
							<Select.Root
								selected={involvedAsOptions.find((option) => option.value === entityEntry.involvedAs)}
								onSelectedChange={(event) => onSelectInvolvedAs(entityEntry, event.value)}
							>
								<Select.Trigger class="w-[180px]">
									<Select.Value>Involved As...</Select.Value>
								</Select.Trigger>
								<Select.Content class="bg-background-900 text-background-50">
									{#each involvedAsOptions as option}
										<Select.Item value={option.value} class="cursor-pointer">{option.label}</Select.Item>
									{/each}
								</Select.Content>
							</Select.Root>

							<!-- remove button -->
							<button class="text-xs" on:click={() => onRemoveEntity(entityEntry)}> Remove </button>
						</div>
					{/key}
				{/each}
			{/if}
		</div>
	</div>

	<!-- Location and Time Filters -->
	<div class="flex flex-col items-center border-2 border-background-800 px-2 py-1 bg-semi-transparent">
		<div>Location/Time Filters</div>
		<div class="flex flex-col gap-1">
			<!-- select for a region, constellation, or system -->
			<SearchSelect on:selected={(value) => onSelectLocation(value)} value={null} placeholder="Location..." type="location" />
			<!-- date range picker -->
			<div class="text-sm">TODO Date Range Picker</div>
		</div>
	</div>
</div>
