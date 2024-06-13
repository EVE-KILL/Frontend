<script lang="ts">
    import type { Corporation } from '../../../types/Corporation.ts';
    import KillList from '../../../components/KillList.svelte';
    export let corporation: Corporation;
    let killlistUrl = `https://eve-kill.com/api/killlist/attackers.corporation_id/${corporation.corporation_id}`;
    let wsFilter = {
        "attackers.corporation_id": corporation.corporation_id
    };
</script>

<KillList url="{killlistUrl}" wsFilter={wsFilter} />
