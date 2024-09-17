<script lang="ts">
	import { get } from 'svelte/store';
	import type { KillmailFilters } from '$lib/types/KillmailFilters';

	import SearchSelect from '$lib/components/ui/SearchSelect.svelte';
	import * as Select from '$lib/components/ui/select';

	import { FILTER_PRESETS, FILTER_PRESET_KEYS } from '$lib/models/useConstants';
	import { killmailFilters } from '$lib/stores/killmails';
	import { useKillmails } from '$lib/models/useKillmails';
	const { setFilters, setFilterPreset } = useKillmails();

	interface InvolvedEntityEntry {
		entity: { id?: number; name?: string; type?: string };
		involvedAs: string;
	}

	const involvedAsOptions = [
		{ value: 'victim', label: 'Victim' },
		{ value: 'attacker', label: 'Attacker' },
		{ value: 'both', label: 'Victim or Attacker' }
	];

	const presetOptions = [
		FILTER_PRESET_KEYS.none,
		FILTER_PRESET_KEYS.recent,
		FILTER_PRESET_KEYS.highsec,
		FILTER_PRESET_KEYS.lowsec,
		FILTER_PRESET_KEYS.nullsec,
		FILTER_PRESET_KEYS.wspace,
		FILTER_PRESET_KEYS.abyssal,
		FILTER_PRESET_KEYS.biggest,
		FILTER_PRESET_KEYS.solo,
		FILTER_PRESET_KEYS.npc,
		FILTER_PRESET_KEYS.over5b,
		FILTER_PRESET_KEYS.over10b,
		FILTER_PRESET_KEYS.citadels,
		FILTER_PRESET_KEYS.t1,
		FILTER_PRESET_KEYS.t2,
		FILTER_PRESET_KEYS.t3,
		FILTER_PRESET_KEYS.frigates,
		FILTER_PRESET_KEYS.destroyers,
		FILTER_PRESET_KEYS.cruisers,
		FILTER_PRESET_KEYS.battlecruisers,
		FILTER_PRESET_KEYS.battleships,
		FILTER_PRESET_KEYS.capitals,
		FILTER_PRESET_KEYS.freighters,
		FILTER_PRESET_KEYS.supercapitals,
		FILTER_PRESET_KEYS.titans
	];

	let filters: KillmailFilters = get(killmailFilters);
	let localInvolvedEntities: InvolvedEntityEntry[] =
		filters.involved_entities?.map((entity) => {
			return {
				entity: {
					id: entity.entity_id,
					name: entity.entity_name,
					type: entity.entity_type
				},
				involvedAs: entity.involved_as
			};
		}) || [];

	const setNewFilters = () => {
		// we want to compile all the filters into a single object
		// and then pass that object to the setFilters function

		// we want to filter out invalid entity entries
		let validEntities = localInvolvedEntities.filter((entity) => entity.entity.id && entity.entity.name && entity.entity.type);

		// we need to format the involved entities back into the format the filters expects
		const newFilters = {
			...filters,
			involved_entities:
				validEntities?.map((entity) => {
					return {
						entity_id: entity.entity.id,
						entity_name: entity.entity.name,
						entity_type: entity.entity.type,
						involved_as: entity.involvedAs
					};
				}) || []
		};

		setFilters(newFilters);
	};

	const updateFilterUI = () => {
		filters = get(killmailFilters);
		localInvolvedEntities =
			filters.involved_entities?.map((entity) => {
				return {
					entity: {
						id: entity.entity_id,
						name: entity.entity_name,
						type: entity.entity_type
					},
					involvedAs: entity.involved_as
				};
			}) || [];
	};

	const onSelectEntity = (entityEntry: InvolvedEntityEntry, value: any) => {
		entityEntry.entity = value.detail;
		setNewFilters();
	};

	const onSelectInvolvedAs = (entityEntry: InvolvedEntityEntry, value: any) => {
		entityEntry.involvedAs = value;
		setNewFilters();
	};

	const onSelectLocation = (value: CustomEvent) => {
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

	const onSelectFilterPreset = (value: string) => {
		if (value === null) {
			return;
		}

		setFilterPreset(value);
		updateFilterUI();
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
		<div>Presets</div>

		<Select.Root selected={{ value: '', label: 'None' }} onSelectedChange={(event) => onSelectFilterPreset(event.value)}>
			<Select.Trigger class="w-[180px]">
				<Select.Value>Preset...</Select.Value>
			</Select.Trigger>
			<Select.Content class="bg-background-900 text-background-50 overflow-y-auto max-h-40">
				{#each presetOptions as option}
					{#if FILTER_PRESETS[option]}
						<Select.Item value={option} class="cursor-pointer capitalize">{FILTER_PRESETS[option].label}</Select.Item>
					{/if}
				{/each}
			</Select.Content>
		</Select.Root>
	</div>

	<!-- Involved Entity Filters -->
	<div class="flex flex-col border-2 border-background-800 px-2 py-1 bg-semi-transparent">
		<div class="flex">
			<div class="mr-6">Involved Entity Filters</div>
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
