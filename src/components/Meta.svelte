<!-- src/lib/components/Meta.svelte -->
<script lang="ts">
    import { meta } from '$lib/Meta.ts';
    import { onMount } from 'svelte';
    import { get } from 'svelte/store';

    let title: string;
    let description: string;
    let keywords: string;
    let robots: string;
    let upstreamUrl: string;
    let siteName: string;
    let creator: string;
    let site: string;

    // Initialize with current meta
    const currentMeta = get(meta);
    title = currentMeta.title;
    description = currentMeta.description;
    keywords = currentMeta.keywords;
    robots = currentMeta.robots;
    upstreamUrl = currentMeta.upstreamUrl;
    siteName = currentMeta.siteName;
    creator = currentMeta.creator;
    site = currentMeta.site;

    onMount(() => {
        // Subscribe to meta changes
        const unsubscribe = meta.subscribe(updatedMeta => {
            title = updatedMeta.title;
            description = updatedMeta.description;
            keywords = updatedMeta.keywords;
            robots = updatedMeta.robots;
            upstreamUrl = updatedMeta.upstreamUrl;
            siteName = updatedMeta.siteName;
            creator = updatedMeta.creator;
            site = updatedMeta.site;

            // Update document title dynamically
            document.title = title;
        });

        return () => {
            unsubscribe();
        };
    });
</script>

<svelte:head>
    <title>{title}</title>
    <meta name="description" content={description}>
    <meta name="keywords" content={keywords}>
    <meta name="robots" content={robots}>
    <link rel="canonical" href={upstreamUrl}>
    <link rel="search" type="application/opensearchdescription+xml" title={siteName} href="/search.xml">

    <!-- Open Graph -->
    <meta property="og:title" content={title} />
    <meta property="og:type" content="website" />
    <meta property="og:url" content={upstreamUrl} />
    <meta property="og:image" content="%sveltekit.assets%/logo.png" />
    <meta property="og:description" content={description} />
    <meta property="og:site_name" content={siteName} />
    <meta property="og:locale" content="en_US" />

    <!-- Twitter -->
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:site" content={site} />
    <meta name="twitter:creator" content={creator} />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image" content="%sveltekit.assets%/logo.png" />
</svelte:head>
