<!-- src/routes/+layout.svelte -->
<script lang="ts">
	import { page } from '$app/stores';

	import '../app.css';
	import '@fortawesome/fontawesome-free/css/all.min.css';
	import Navbar from '../components/Navbar.svelte';
</script>

<svelte:head>
	<!-- Title -->
	<title>{$page.data.meta?.title || 'EVE-KILL'}</title>

	<!-- Meta tags -->
	<meta
		name="description"
		content={$page.data.meta?.description ||
			'EVE-KILL is a killboard for the MMORPG EVE-Online'}
	/>
	<meta
		name="keywords"
		content={$page.data.meta?.keywords ||
			'eve-online, eve, ccp, ccp games, kills, kills, killboard, eve-kill, eve-kill.net, eve-kill.com'}
	/>
	<meta name="robots" content={$page.data.meta?.robots || 'index, follow'} />
	<meta name="creator" content={$page.data.meta?.creator || '@eve_kill'} />
	<meta property="og:site_name" content={$page.data.meta?.siteName || 'EVE-KILL'} />
	<meta property="og:image" content={$page.data.meta?.image || '/icon.png'} />
	<meta property="og:type" content={$page.data.meta?.type || 'website'} />
	<meta property="og:title" content={$page.data.meta?.title || 'EVE-KILL'} />
	<meta property="og:description" content={$page.data.meta?.description || 'EVE-KILL'} />
	<meta name="twitter:site" content={$page.data.meta?.site || '@eve_kill'} />
	<meta name="twitter:creator" content={$page.data.meta?.creator || '@eve_kill'} />
	<meta name="twitter:card" content={$page.data.meta?.card || 'summary'} />
	<meta name="twitter:image" content={$page.data.meta?.image || '/icon.png'} />

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
