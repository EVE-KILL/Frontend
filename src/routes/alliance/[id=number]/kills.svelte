<script lang="ts">
    import type { Alliance } from '../../../types/Alliance.ts';
    import KillList from '../../../components/KillList.svelte';
    export let alliance: Alliance;
    let killlistUrl = `https://eve-kill.com/api/killlist/attackers.alliance_id/${alliance.alliance_id}`;
    let wsFilter = {
        "attackers.alliance_id": alliance.alliance_id
    };
</script>

<KillList url="{killlistUrl}" wsFilter={wsFilter} />
