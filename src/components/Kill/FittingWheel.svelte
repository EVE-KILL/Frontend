<script lang="ts">
    import type { Fitting } from '../../../types/Killmail/Fitting.ts';
    import { generateEveShipFit } from '$lib/Killmail.ts';
    import { onMount } from 'svelte';
	import {
		ShipFit,
		CurrentCharacterProvider,
		DefaultCharactersProvider,
		EveDataProvider,
		DogmaEngineProvider,
		CurrentFitProvider,
		StatisticsProvider
	} from '@eveshipfit/react';

	export let killmail;
    let fit: Fitting;

    onMount(async() => {
        fit = await generateEveShipFit(killmail);
    });

</script>

{#if fit}
<div class="fitting-wheel">
	<react:CurrentFitProvider initialFit={fit}>
		<react:EveDataProvider dataUrl="/sde/">
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
{/if}
<style>
	.fitting-wheel {
		position: relative;
		top: 0;
		right: 0;
		width: 100%;
		height: 100%;
		max-width: 550px;
		max-height: 550px;
		aspect-ratio: 1 / 1;
	}
</style>
