<script lang="ts">
    import { browser } from '$app/environment';
    import { onMount, onDestroy } from 'svelte';
    import { createScalarReferences } from '@scalar/api-reference';
    import type { ReferenceConfiguration } from '@scalar/api-reference';
    import { getUpstreamUrl } from '$lib/Config';
    import { svelteThemeCss } from './apiTheme';

    const upstreamUrl = getUpstreamUrl();

    let configuration: ReferenceConfiguration = {
        isEditable: false,
        hideDownloadButton: true,
        spec: {
            url: `${upstreamUrl}/api/openapi`,
        }
    };
    let element: HTMLDivElement | null = null;
    let instance: any;

    const applyDefaultCss = (config: ReferenceConfiguration) => {
        if (!config?.customCss && !config?.theme) {
            config.customCss = svelteThemeCss;
        }
    }

    onMount(async () => {
        applyDefaultCss(configuration);
        instance = createScalarReferences(element, configuration);
    });

    onDestroy(() => {
        if (browser) {
            instance.unmount();
            element?.remove();

            // Remove the dark-mode class from body
            document.body.classList.remove('dark-mode');
        }
    });
</script>

<div class="scalar" bind:this={element}/>
