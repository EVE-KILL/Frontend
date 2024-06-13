<script lang="ts">
    import type { Character } from '../../../types/Character.ts';
    import KillList from '../../../components/KillList.svelte';
    export let character: Character;
    let killlistUrl = `https://eve-kill.com/api/killlist/victim.character_id/${character.character_id}`;
    let wsFilter = {
        "victim.character_id": character.character_id
    };
</script>

<KillList url="{killlistUrl}" wsFilter={wsFilter} />
