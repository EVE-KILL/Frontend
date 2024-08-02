<script lang="ts">
	import type { Corporation } from '../../../types/Corporation.ts';
	import { onMount } from 'svelte';
	import { convertEveHtml } from '$lib/Helpers.js';

	export let corporation: Corporation;
	let sanitizedDescription: string;

	onMount(async () => {
		let description = convertEveHtml(corporation.description);

		// Remove Python-style string representation prefix if it exists
		if (description.startsWith("u'") || description.startsWith('u"')) {
			description = description.slice(2, -1);
		}

		// Decode Unicode characters
		sanitizedDescription = decodeUnicode(description);
	});

	function decodeUnicode(str: string): string {
		return str.replace(/\\u([\dA-F]{4})/gi, (match, grp) => {
			return String.fromCharCode(parseInt(grp, 16));
		});
	}
</script>

<div class="monospace">
	{@html sanitizedDescription}
</div>

<style>
	.monospace {
		font-family: 'Shentox', monospace;
	}
</style>
