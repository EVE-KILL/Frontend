<script lang="ts">
	import type { KillmailFilters } from '$lib/types/KillmailFilters';

	import { Checkbox } from '$lib/components/ui/checkbox';
	import SearchSelect from '$lib/components/ui/SearchSelect.svelte';
	import { Input } from '$lib/components/ui/input';

	import { useKillmails } from '$lib/models/useKillmails';
	const { setFilters } = useKillmails();

	const filters: KillmailFilters = {
		// npcKills: false,
		misc: {
			kills: true,
			losses: true,
			npc: true,
			solo: true
		}
	};

	const onFilterChange = () => {
		// we want to compile all the filters into a single object
		// and then pass that object to the setFilters function
		console.log('filters changed', filters);

		setFilters(filters);
	};

	const onSelect = (event: CustomEvent, filterCategory: string) => {
		let selectedEntity = event.detail;

		if (filterCategory === 'victim') {
			if (selectedEntity.type === 'character') {
				filters.victim.characterId = selectedEntity.id;
			} else if (selectedEntity.type === 'corporation') {
				filters.victim.corporationId = selectedEntity.id;
			} else if (selectedEntity.type === 'alliance') {
				filters.victim.allianceId = selectedEntity.id;
			}
		} else if (filterCategory === 'attacker') {
			if (selectedEntity.type === 'character') {
				filters.attacker.characterId = selectedEntity.id;
			} else if (selectedEntity.type === 'corporation') {
				filters.attacker.corporationId = selectedEntity.id;
			} else if (selectedEntity.type === 'alliance') {
				filters.attacker.allianceId = selectedEntity.id;
			}
		}
	};
</script>

<div class="flex flex-wrap gap-2 items-center bg-semi-transparent border-2 border-primary-800 rounded-md px-2 py-1 mb-4 w-full">
	<div class="flex flex-col items-center border-2 border-primary-900 rounded-md px-2 py-1 bg-semi-transparent">
		<div>Misc Filters</div>
		<div class="flex flex-col gap-1">
			<!-- Checkbox for kills -->
			<div class="flex items-center gap-1">
				<Checkbox bind:checked={filters.misc.kills} onCheckedChange={onFilterChange} />
				<div class="text-sm">Kills</div>
			</div>
			<!-- Checkbox for losses -->
			<div class="flex items-center gap-1">
				<Checkbox bind:checked={filters.misc.losses} onCheckedChange={onFilterChange} />
				<div class="text-sm">Losses</div>
			</div>
			<!-- checkbox for NPC kills -->
			<div class="flex items-center gap-1">
				<Checkbox bind:checked={filters.misc.npc} onCheckedChange={onFilterChange} />
				<div class="text-sm">NPC Kills</div>
			</div>
			<!-- checkbox for solo kills -->
			<div class="flex items-center gap-1">
				<Checkbox bind:checked={filters.misc.solo} onCheckedChange={onFilterChange} />
				<div class="text-sm">Solo Kills</div>
			</div>
			<!-- checkbox for 'entity you are looking at got the final blow' -->
		</div>
	</div>

	<!-- Victim Filters -->
	<div class="flex flex-col items-center border-2 border-primary-900 rounded-md px-2 py-1 bg-semi-transparent">
		<div>Victim Filters</div>
		<div class="flex gap-1">
			<div class="flex flex-col gap-1">
				<!-- select for a character, corporation, or alliance -->
				<SearchSelect on:selected={(event) => onSelect(event, 'victim')} placeholder="Victim Entity..." />
				<!-- select for a ship category or specific ship type -->
				<div class="text-sm py-2">TODO ship category/type</div>
			</div>

			<div class="flex flex-col gap-1">
				<!-- number range thing for ISK value -->
				<Input type="number" placeholder="Min ISK Value..." class="bg-black" />

				<Input type="number" placeholder="Max ISK Value..." class="bg-black" />
			</div>
		</div>
	</div>

	<!-- Attacker Filters -->
	<div class="flex flex-col items-center border-2 border-primary-900 rounded-md px-2 py-1 bg-semi-transparent">
		<div>Attacker Filters</div>
		<div class="flex flex-col gap-1">
			<!-- select for a character, corporation, or alliance -->
			<SearchSelect on:selected={(event) => onSelect(event, 'attacker')} placeholder="Attacker Entity..." />
			<!-- select for a ship category or specific ship type -->
			<div class="text-sm py-2">TODO ship category/type</div>
		</div>
	</div>

	<!-- Location and Time Filters -->
	<div class="flex flex-col items-center border-2 border-primary-900 rounded-md px-2 py-1 bg-semi-transparent">
		<div>Location/Time Filters</div>
		<div class="flex flex-col gap-1">
			<!-- select for a region, constellation, or system -->
			<div class="text-sm">TODO Location region/const/system picker</div>
			<!-- date range picker -->
			<div class="text-sm">TODO Date Range Picker</div>
		</div>
	</div>
</div>
