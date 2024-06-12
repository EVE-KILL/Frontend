<script>
    import KillList from '../components/KillList.svelte';
    import Characters from '../components/Top10Boxes/Characters.svelte';
    const url = "https://eve-kill.com/api/killlist/latest";
</script>

<div class="container flex h-screen">
    <div class="w-1/4 p-4">
        <Characters url="https://eve-kill.com/api/stats/top10characters" />
    </div>
    <div class="w-full">
        <KillList {url} />
    </div>
</div>
