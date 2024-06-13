<script lang="ts">
    import type { Character } from '../../../types/Character.ts';
    import KillList from '../../../components/KillList.svelte';
    import { onMount } from 'svelte';
    export let character: Character;
    let killlistUrl = `https://eve-kill.com/api/killlist/attackers.character_id/${character.character_id}`;
    let wsFilter = {
        "attackers.character_id": character.character_id
    };
</script>

<KillList url="{killlistUrl}" wsFilter={wsFilter} />
