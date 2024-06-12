<script>
    import '../app.css';
    import Navbar from '../components/Navbar.svelte';
</script>

<div id="content" class="content flex flex-col h-screen mx-auto max-w-7xl">
    <div id="inner-content" class="inner-content">
        <Navbar />

        <div id="page-title" class="page-title">
            <div class="text-white text-2xl font-bold">Frontpage</div>
            <!-- underline across the entire width -->
            <div class="border-b-2 border-gray-800 w-full mt-2"/>
        </div>
        <slot />
    </div>
</div>
