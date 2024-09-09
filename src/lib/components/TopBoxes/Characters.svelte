<script lang="ts">
	import { onMount } from 'svelte';
	import type { Character } from '$lib/types/Top/Character';

	export let url: string;
	export let count: number = 10;
	export let days: number = 7;
	let characters: Character[] = [];

	onMount(async () => {
		const response = await fetch(url);
		characters = await response.json();
	});
</script>

<div class="text-sm font-bold text-center bg-background-900">
	Top {count} Characters
</div>

{#each characters as character (character.character_id)}
	<button
		class="grid grid-cols-2 items-center bg-semi-transparent border-b-2 border-background-800 w-full py-1"
		on:click={() => (window.location.href = `/character/${character.character_id}`)}
	>
		<div class="flex items-center">
			<img src="https://images.evetech.net/characters/{character.character_id}/portrait?size=64" alt="Character: {character.name}" class="w-7" />

			<div class="text-sm text-left text-primary-400 whitespace-nowrap ml-2">{character.name}</div>
		</div>

		<div class="text-sm text-right text-background-200 pr-4">{character.count}</div>
	</button>
{/each}

<div class="text-sm bg-semi-transparent text-center text-background-300 py-1 rounded-br-lg rounded-bl-lg">(Kills over last {days} days)</div>
