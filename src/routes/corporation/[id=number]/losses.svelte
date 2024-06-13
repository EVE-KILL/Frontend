<script lang="ts">
    import type { Corporation } from '../../../types/Corporation.ts';
    import KillList from '../../../components/KillList.svelte';
    export let corporation: Corporation;
    let killlistUrl = `https://eve-kill.com/api/killlist/victim.corporation_id/${corporation.corporation_id}`;
    let wsFilter = {
        "victim.corporation_id": corporation.corporation_id
    };
</script>

<KillList url="{killlistUrl}" wsFilter={wsFilter} />
