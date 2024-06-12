<script lang="ts">
    import '../app.css';
    import Navbar from '../components/Navbar.svelte';
    import { pageTitle } from '../stores/pageTitleStore';

    let title: string;
    pageTitle.subscribe(value => {
        title = value;
    });
</script>

<div id="content" class="content flex flex-col mx-auto max-w-7xl">
    <div id="inner-content" class="inner-content">
        <Navbar />

        <div id="page-title" class="page-title pb-2 ml-5">
            <div class="text-white text-2xl font-bold">{title}</div>
        </div>

        <slot />
    </div>
</div>

<svelte:head>
    <title>EVE-KILL | {title}</title>
</svelte:head>

<style>
    .content {
        background-color: rgba(21, 21, 21, 0.7);
        border: 2px solid #252525;
        border-radius: 10px;
    }
</style>
