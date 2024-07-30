<script lang="ts">
	import type { Killmail } from '../../../types/Killmail.ts';
	import { generateEveShipFit } from '$lib/Killmail.ts';
	import {
		ShipFit,
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
	let fit;

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
				<react:EveDataProvider>
					<react:DogmaEngineProvider>
						<react:CurrentFitProvider initialFit={fit}>
							<react:DefaultCharactersProvider>
								<react:StatisticsProvider>
									<react:ShipFit />
								</react:StatisticsProvider>
							</react:DefaultCharactersProvider>
						</react:CurrentFitProvider>
					</react:DogmaEngineProvider>
				</react:EveDataProvider>
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
