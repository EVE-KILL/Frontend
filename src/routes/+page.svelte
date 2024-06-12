<script>
    import KillList from '../components/KillList.svelte';
    import Characters from '../components/Top10Boxes/Characters.svelte';
    import Corporations from '../components/Top10Boxes/Corporations.svelte';
    import Alliances from '../components/Top10Boxes/Alliances.svelte';
    import Systems from '../components/Top10Boxes/Systems.svelte';
    import Regions from '../components/Top10Boxes/Regions.svelte';
    const url = "https://eve-kill.com/api/killlist/latest";
</script>

<div class="container flex h-screen p-2 pt-4 gap-2">
    <div class="w-1/4">
        <div class="pb-5">
            <Characters url="https://eve-kill.com/api/stats/top10characters" />
        </div>
        <div class="pb-5">
            <Corporations url="https://eve-kill.com/api/stats/top10corporations" />
        </div>
        <div class="pb-5">
            <Alliances url="https://eve-kill.com/api/stats/top10alliances" />
        </div>
        <div class="pb-5">
            <Systems url="https://eve-kill.com/api/stats/top10solarsystems" />
        </div>
        <div class="pb-5">
            <Regions url="https://eve-kill.com/api/stats/top10regions" />
        </div>
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
