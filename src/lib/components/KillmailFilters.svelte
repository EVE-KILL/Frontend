<script lang="ts">
	import type { KillmailFilters } from '$lib/types/KillmailFilters';

	import { Checkbox } from '$lib/components/ui/checkbox';
	import SearchSelect from '$lib/components/ui/SearchSelect.svelte';

	import { useKillmails } from '$lib/models/useKillmails';
	const { setFilters } = useKillmails();

	const filters: KillmailFilters = {
		npcKills: false
	};

	const onFilterChange = () => {
		// we want to compile all the filters into a single object
		// and then pass that object to the setFilters function

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

<div class="flex gap-2 items-center mb-4">
	<!-- Victim Filters -->
	<!-- select for a character, corporation, or alliance -->
	<SearchSelect on:selected={(event) => onSelect(event, 'victim')} />
	<!-- select for a ship category or specific ship type -->
	<!-- number range thing for ISK value -->

	<!-- Attacker Filters -->
	<!-- select for a character, corporation, or alliance -->
	<SearchSelect on:selected={(event) => onSelect(event, 'attacker')} />
	<!-- select for a ship category or specific ship type -->

	<!-- Location and Time Filters -->
	<!-- select for a region, constellation, or system -->
	<!-- date range picker -->

	<!-- Misc Filters -->
	<!-- checkbox for NPC kills -->
	<!-- checkbox for solo kills -->
	<!-- checkbox for 'entity you are looking at got the final blow' -->

	<!-- <Checkbox label="NPC Kills" checked={filters.npcKills} on:change={() => onFilterChange()} /> -->
</div>
