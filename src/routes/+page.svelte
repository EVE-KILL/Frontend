<script>
    import KillList from '../components/KillList.svelte';
    import { onMount } from 'svelte';
    import { fetchKillList } from '$lib/fetchKillList.js';

    // Define the killlist data
    let kills = [];

    // Fetch the killlist data
    onMount(async () => {
        kills = await fetchKillList();
    });

</script>
ß
<KillList {kills} />
