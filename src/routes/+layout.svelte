<script>
    import '../app.css';
    import Navbar from '../components/Navbar.svelte';
</script>

<div id="content" class="content flex flex-col h-screen mx-auto max-w-7xl">
    <div id="inner-content" class="inner-content">
        <Navbar />

        <div id="page-title" class="page-title pb-2 ml-5">
            <div class="text-white text-2xl font-bold">Frontpage</div>
        </div>
        <slot />
    </div>
</div>
