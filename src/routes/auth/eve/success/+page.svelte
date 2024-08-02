<script lang="ts">
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import { session, logout } from '$lib/stores/Session.ts';
    import { getUpstreamUrl } from '$lib/Config.ts';
    import { goto } from '$app/navigation';

    let hash: string | null = null;
    let user: { character_name: string, character_id: number, expiration: string, identifier: string } | null = null;

    const upstreamUrl = getUpstreamUrl();

    onMount(async () => {
        const queryParams = new URLSearchParams($page.url.search);
        hash = queryParams.get('hash');
        if (hash) {
            try {
                const response = await fetch(`${upstreamUrl}/api/auth/login/${hash}`);
                if (response.ok) {
                    const data = await response.json();
                    user = {
                        character_name: data.character_name,
                        character_id: data.character_id,
                        expiration: data.expiration,
                        identifier: data.identifier
                    };
                    session.set({ user });
                    goto('/'); // Redirect to homepage after setting the session
                } else {
                    console.error('Failed to fetch user data');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        } else {
            session.subscribe(value => {
                user = value.user;
            });
        }
    });
</script>

<div class="text-white">
    {#if user}
        <p>Redirecting to homepage...</p>
    {/if}
</div>
