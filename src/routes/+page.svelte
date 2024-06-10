<script>
    import { onMount, afterUpdate } from 'svelte';
    import KillList from '../components/KillList.svelte';
    import { fetchKillList } from '$lib/fetchKillList.js';

    let kills = [];
    let page = 1;
    let loading = false;
    let sentinel;
    let observer;

    async function loadMore() {
        if (loading) return;
        loading = true;
        const newKills = await fetchKillList(page);
        kills = [...kills, ...newKills];
        page++;
        loading = false;
    }

    onMount(async () => {
        loadMore();
        observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                loadMore();
            }
        }, { threshold: 1 });
    });

    afterUpdate(() => {
        if (sentinel) {
            observer.observe(sentinel);
        }
    });
</script>

<KillList {kills} />

<!-- Add a sentinel element at the bottom of your page -->
<div bind:this={sentinel}></div>
