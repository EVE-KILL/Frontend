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

<div class="fitting-wheel">
	<react:CurrentFitProvider initialFit={fit}>
		<react:EveDataProvider dataUrl="https://eve-kill.com/sde/">
			<react:DogmaEngineProvider>
				<react:DefaultCharactersProvider>
					<react:CurrentCharacterProvider>
						<react:StatisticsProvider>
							<react:ShipFit withStats />

						</react:StatisticsProvider>
					</react:CurrentCharacterProvider>
				</react:DefaultCharactersProvider>
			</react:DogmaEngineProvider>
		</react:EveDataProvider>
	</react:CurrentFitProvider>
</div>

<style>
	.fitting-wheel {
		position: relative;
		top: 0;
		right: 0;
		width: 600px;
		height: 600px;
		min-width: 600px;
		min-height: 600px;
	}
</style>
