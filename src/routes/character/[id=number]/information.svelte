<script lang="ts">
	import type { Character } from '../../../types/Character.ts';
	import { onMount } from 'svelte';
	import DOMPurify from 'dompurify';

	export let character: Character;
	let sanitizedDescription: string;

	onMount(async () => {
		let description = character.description;

		// Remove Python-style string representation prefix if it exists
		if (description.startsWith("u'") || description.startsWith('u"')) {
			description = description.slice(2, -1);
		}

		// Sanitize the description
		sanitizedDescription = DOMPurify.sanitize(description, {
			FORBID_ATTR: ['size']
		});

		// Decode Unicode characters
		sanitizedDescription = decodeUnicode(sanitizedDescription);
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
