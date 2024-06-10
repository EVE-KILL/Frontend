<script>
    import KillList from '../components/KillList.svelte';
    const url = "https://eve-kill.com/api/killlist/latest";
</script>

<KillList {url} />
