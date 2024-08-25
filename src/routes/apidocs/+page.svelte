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

    const centerElementOnPage = () => {
        if (element) {
            const viewportHeight = window.innerHeight;
            const scrollY = window.scrollY;

            // Calculate top position so the element is centered in the viewport
            const topPosition = scrollY + 450;

            // Set the top value dynamically
            const scalarAppLayout = element.querySelector('.scalar-app .scalar-app-layout[data-v-fdd52d50]');
            if (scalarAppLayout) {
                scalarAppLayout.style.position = 'absolute';
                scalarAppLayout.style.top = `${topPosition}px`;
            }
        }
    };

    onMount(async () => {
        applyDefaultCss(configuration);
        instance = createScalarReferences(element, configuration);

        // Center the element initially and bind events for scroll and resize
        centerElementOnPage();
        window.addEventListener('resize', centerElementOnPage);
        window.addEventListener('scroll', centerElementOnPage);
    });

    onDestroy(() => {
        if (browser) {
            instance.unmount();
            element?.remove();

            // Clean up event listeners
            window.removeEventListener('resize', centerElementOnPage);
            window.removeEventListener('scroll', centerElementOnPage);

            // Remove the dark-mode class from body
            document.body.classList.remove('dark-mode');
        }
    });
</script>

<div class="scalar" bind:this={element}/>

<style>
    .scalar {
        background-color: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(10px);
    }

    /* Optional: Add additional styles to the .scalar-app-layout if needed */
    .scalar-app .scalar-app-layout[data-v-fdd52d50] {
        max-height: 550px; /* Set max height as per your requirement */
        width: 100%; /* Adjust the width as necessary */
        overflow: auto; /* Handle overflow */
        z-index: 1001; /* Ensure it appears above other content */
    }
</style>
