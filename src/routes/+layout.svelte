<script lang="ts">
	import { page } from '$app/stores';
	import { onNavigate } from '$app/navigation';
	import { get } from 'svelte/store';
	import { meta } from '$lib/stores/Meta.ts';

	import '../app.css';
	import '@fortawesome/fontawesome-free/css/all.min.css';
	import Navbar from '../components/Navbar.svelte';

	// Default meta values
	let defaultKeywords = 'eve-online, eve, ccp, ccp games, kills, killmail, killmails, killboard, eve kill, eve-kill, eve-kill.net, eve-kill.com';
	let defaultTitle = 'EVE-KILL';
	let defaultDescription = 'EVE-KILL is a killboard for the MMORPG EVE-Online';
	let defaultImage = '/icon.png';
	let defaultRobots = 'index, follow';
	let defaultCreator = '@eve_kill';
	let defaultSiteName = 'EVE-KILL';
	let defaultType = 'website';
	let defaultCard = 'summary';
	let defaultSite = '@eve_kill';

	// Store the current path without query or hash
	let currentPath = get(page).url.pathname;

	// Combine meta information
	let combinedMeta = {};
	page.subscribe(($page) => {
		meta.subscribe((customMeta) => {
			// Ensure the title always starts with "EVE-KILL"
			const baseTitle = 'EVE-KILL';
			const pageTitle = customMeta.title || $page.data.meta?.title || defaultTitle;
			const combinedTitle = pageTitle !== baseTitle ? `${baseTitle} | ${pageTitle}` : baseTitle;

			combinedMeta = {
				title: combinedTitle,
				description: customMeta.description || $page.data.meta?.description || defaultDescription,
				keywords: customMeta.keywords || $page.data.meta?.keywords || defaultKeywords,
				robots: customMeta.robots || $page.data.meta?.robots || defaultRobots,
				creator: customMeta.creator || $page.data.meta?.creator || defaultCreator,
				siteName: customMeta.siteName || $page.data.meta?.siteName || defaultSiteName,
				image: customMeta.image || $page.data.meta?.image || defaultImage,
				type: customMeta.type || $page.data.meta?.type || defaultType,
				card: customMeta.card || $page.data.meta?.card || defaultCard,
				site: customMeta.site || $page.data.meta?.site || defaultSite,
				hasCustomMeta: customMeta.hasCustomMeta || $page.data.meta?.hasCustomMeta || false
			};
		});
	});

	onNavigate(async (navigation) => {
		const newPath = navigation.to.url.pathname;

		// Only trigger if the path (excluding query and hash) changes
		if (newPath !== currentPath) {
			// Update the current path
			currentPath = newPath;

			// Reset the meta store on navigation
			meta.set({});
		}
	});
</script>

<svelte:head>
	<!-- Title -->
	<title>{combinedMeta.title}</title>

	<!-- Meta tags -->
	<meta name="description" content={combinedMeta.description} />
	<meta name="keywords" content={combinedMeta.keywords} />
	<meta name="robots" content={combinedMeta.robots} />
	<meta name="creator" content={combinedMeta.creator} />
	<meta property="og:site_name" content={combinedMeta.siteName} />
	<meta property="og:image" content={combinedMeta.image} />
	<meta property="og:type" content={combinedMeta.type} />
	<meta property="og:title" content={combinedMeta.title} />
	<meta property="og:description" content={combinedMeta.description} />
	<meta name="twitter:site" content={combinedMeta.site} />
	<meta name="twitter:creator" content={combinedMeta.creator} />
	<meta name="twitter:card" content={combinedMeta.card} />
	<meta name="twitter:image" content={combinedMeta.image} />
	<meta name="twitter:title" content={combinedMeta.title} />
	<meta name="twitter:description" content={combinedMeta.description} />

	<!-- Custom Meta (if applicable) -->
	{#if combinedMeta.hasCustomMeta}
		<!-- Additional custom meta tags go here -->
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
