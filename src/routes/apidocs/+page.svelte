<script lang="ts">
    import { onMount } from 'svelte';
    import { getUpstreamUrl } from '$lib/Config';
    const upstreamUrl = getUpstreamUrl();

    // Template literal for multi-line HTML content
    let html = `
        \<script id="api-reference" data-url="${upstreamUrl}/api/openapi"\>\</script\>
        \<script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"\>\</script\>
    `;
</script>

{@html html}
