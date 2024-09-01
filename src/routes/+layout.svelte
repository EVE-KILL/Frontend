<!-- src/routes/+layout.svelte -->
<script lang="ts">
	import { page } from '$app/stores';
	import { onNavigate } from '$app/navigation';
	import { get } from 'svelte/store';

	import '../app.css';
	import '@fortawesome/fontawesome-free/css/all.min.css';
	import Navbar from '../components/Navbar.svelte';

	let defaultKeywords = 'eve-online, eve, ccp, ccp games, kills, killmail, killmails, killboard, eve kill, eve-kill, eve-kill.net, eve-kill.com';
	let combinedKeywords = $page.data.meta?.keywords ? `${defaultKeywords}, ${$page.data.meta.keywords}` : defaultKeywords;
	let defaultTitle = 'EVE-KILL';
	let combinedTitle = $page.data.meta?.title ? `${defaultTitle} - ${$page.data.meta.title}` : defaultTitle;

	// Store the current path without query or hash
	let currentPath = get(page).url.pathname;

	onNavigate(async (navigation) => {
		const newPath = navigation.to.url.pathname;

		// Only trigger if the path (excluding query and hash) changes
		if (newPath !== currentPath) {
			// Update the current path
			currentPath = newPath;

			// Reset the page meta back to default
			combinedKeywords = defaultKeywords;
			combinedTitle = defaultTitle;
		}
	});
</script>

<svelte:head>
	<!-- Title -->
	<title>{combinedTitle}</title>

	<!-- Meta tags -->
	<meta
		name="description"
		content={$page.data.meta?.description ||
			'EVE-KILL is a killboard for the MMORPG EVE-Online'}
	/>

	<meta name="keywords" content={combinedKeywords} />
	<meta name="robots" content={$page.data.meta?.robots || 'index, follow'} />
	<meta name="creator" content={$page.data.meta?.creator || '@eve_kill'} />
	<meta property="og:site_name" content={$page.data.meta?.siteName || 'EVE-KILL'} />
	<meta property="og:image" content={$page.data.meta?.image || '/icon.png'} />
	<meta property="og:type" content={$page.data.meta?.type || 'website'} />
	<meta property="og:title" content={combinedTitle} />
	<meta property="og:description" content={$page.data.meta?.description || 'EVE-KILL'} />
	<meta name="twitter:site" content={$page.data.meta?.site || '@eve_kill'} />
	<meta name="twitter:creator" content={$page.data.meta?.creator || '@eve_kill'} />
	<meta name="twitter:card" content={$page.data.meta?.card || 'summary'} />
	<meta name="twitter:image" content={$page.data.meta?.image || '/icon.png'} />
	<meta name="twitter:title" content={combinedTitle} />
	<meta name="twitter:description" content={$page.data.meta?.description || 'EVE-KILL'} />

	<!-- Custom Meta (if applicable) -->
	{#if $page.data.meta?.hasCustomMeta}
		<!-- You can add any additional custom meta tags here based on page-specific needs -->
	{/if}
</svelte:head>

<div id="content" class="content flex flex-col mx-auto">
	<div id="inner-content" class="inner-content">
		<Navbar />
		<slot />
	</div>
</div>

<style>
	.content {
		max-width: 90rem;
		background-color: rgba(21, 21, 21, 0.5);
		border: 2px solid #252525;
		padding: 5px;
		border-radius: 10px;
	}

	#content > #inner-content {
		display: block;
		border: 5px solid rgba(0, 0, 0, 0.5);
		padding: 0px 20px 20px 20px;
		background: rgba(0, 0, 0, 0.65);
		margin-bottom: 5px;
	}
</style>
