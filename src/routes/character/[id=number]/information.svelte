<script lang="ts">
    import type { Character } from '../../../types/Character.ts';
    import { onMount } from 'svelte';
    import DOMPurify from 'dompurify';

    export let character: Character;
    let sanitizedDescription: string;

    onMount(async () => {
        sanitizedDescription = DOMPurify.sanitize(character.description, {
            FORBID_ATTR: ['size']
        });
    });
</script>

{@html sanitizedDescription}
