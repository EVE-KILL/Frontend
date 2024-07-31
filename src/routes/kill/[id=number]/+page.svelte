<script lang="ts">
	import type { Killmail } from '../../../types/Killmail.ts';
	import type { Fitting } from '../../../types/Killmail/Fitting.ts';
	import { generateEveShipFit } from '$lib/Killmail.ts';
	import {
		ShipFit,
		CurrentCharacterProvider,
		DefaultCharactersProvider,
		EveDataProvider,
		DogmaEngineProvider,
		CurrentFitProvider,
		StatisticsProvider,
		useImportEveShipFit
	} from '@eveshipfit/react';
	import { onMount } from 'svelte';

	export let data;
	let killmail: Killmail;
	let fit: Fitting;

	onMount(async () => {
		const response = await fetch(`https://eve-kill.com/api/killmail/${data.id}`);
		killmail = await response.json();

		// Generate the ESF for the killmail
		fit = await generateEveShipFit(killmail.killmail_id);
	});
</script>

{#if killmail && fit}
	<div class="container flex p-2 pt-4 gap-2">
		<!-- Left Container -->
		<div class="w-full bg-gray-800 text-white p-4 rounded-lg shadow-lg">
			<!-- Fitting Wheel -->
			<div
				class="relative top-0 right-0 p-2"
				style="position: relative; width: 480px; height: 480px;"
			>
				<react:CurrentFitProvider initialFit={fit}>
					<react:EveDataProvider dataUrl="https://eve-kill.com/sde/">
						<react:DogmaEngineProvider>
							<react:DefaultCharactersProvider>
								<react:CurrentCharacterProvider>
									<react:StatisticsProvider>
										<react:ShipFit withStats isPreview />
									</react:StatisticsProvider>
								</react:CurrentCharacterProvider>
							</react:DefaultCharactersProvider>
						</react:DogmaEngineProvider>
					</react:EveDataProvider>
				</react:CurrentFitProvider>
			</div>

			<!-- Kill Information -->

			<!-- Items Dropped/Destroyed -->
		</div>

		<!-- Right Container -->
		<div class="w-2/4 bg-gray-900 text-white p-4 rounded-lg shadow-lg"></div>
	</div>
{/if}

<style>
	/* You can add custom styles here if needed */
</style>
