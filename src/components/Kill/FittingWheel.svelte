<script lang="ts">
    import type { Fitting } from '../../../types/Killmail/Fitting.ts';
    import { generateEveShipFit } from '$lib/Killmail.ts';
    import { onMount } from 'svelte';
    import ResizeObserver from 'resize-observer-polyfill';
    import {
        ShipFit,
        ShipAttribute,
        Icon,
        CurrentCharacterProvider,
        DefaultCharactersProvider,
        EveDataProvider,
        DogmaEngineProvider,
        CurrentFitProvider,
        StatisticsProvider
    } from '@eveshipfit/react';

    export let killmail;
    let fit: Fitting;
    let fittingWheelContainer: HTMLDivElement;

    onMount(async() => {
        fit = await generateEveShipFit(killmail);

        const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                const { width } = entry.contentRect;
                fittingWheelContainer.style.height = `${width}px`;
            }
        });

        resizeObserver.observe(fittingWheelContainer);
    });
</script>

<div bind:this={fittingWheelContainer} class="fitting-wheel-container">
    <div class="fitting-wheel">
        <react:CurrentFitProvider initialFit={fit}>
            <react:EveDataProvider dataUrl="https://eve-kill.com/sde/">
                <react:DogmaEngineProvider>
                    <react:DefaultCharactersProvider>
                        <react:CurrentCharacterProvider>
                            <react:StatisticsProvider>
                                <react:ShipFit withStats readOnly />
                                <!--<react:ShipAttribute name="shieldCapacity" fixed={0} roundDown unit="hp" />-->
                                <!--<react:Icon name="warp-speed" />-->
                                <!-- https://github.com/EVEShipFit/react/blob/main/src/components/ShipStatistics/ShipStatistics.tsx -->
                            </react:StatisticsProvider>
                        </react:CurrentCharacterProvider>
                    </react:DefaultCharactersProvider>
                </react:DogmaEngineProvider>
            </react:EveDataProvider>
        </react:CurrentFitProvider>
    </div>
</div>

<style>
    .fitting-wheel-container {
        width: 100%;
        max-width: 600px;
        margin: 0 auto;
        position: relative;
    }

    .fitting-wheel {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
    }

    .fitting-wheel > * {
        width: 100%;
        height: 100%;
    }
</style>
