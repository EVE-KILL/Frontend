<script lang="ts">
    import type { Alliance } from '../../../types/Alliance.ts';
    import KillList from '../../../components/KillList.svelte';
    export let alliance: Alliance;
    let killlistUrl = `https://eve-kill.com/api/killlist/victim.alliance_id/${alliance.alliance_id}`;
    let wsFilter = {
        "victim.alliance_id": alliance.alliance_id
    };
</script>

<KillList url="{killlistUrl}" wsFilter={wsFilter} />
