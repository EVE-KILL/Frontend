<script>
    import KillList from '../components/KillList.svelte';
    import Characters from '../components/Top10Boxes/Characters.svelte';
    const url = "https://eve-kill.com/api/killlist/latest";
</script>

<div class="container flex h-screen p-2 pt-4 gap-2">
    <div class="w-1/4">
        <Characters url="https://eve-kill.com/api/stats/top10characters" />
    </div>
    <div class="w-full">
        <KillList {url} />
    </div>
</div>

<style>
    .container {
        background-color: rgba(21, 21, 21, 0.7);
        border: 2px solid #252525;
        border-radius: 10px;
    }
</style>
