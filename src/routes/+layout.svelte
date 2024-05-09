<script>
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import Navbar from './Navbar.svelte';
	import './styles.css';

	onMount(async () => {
		if (!browser) return;

		// this is enough for most components
		await import('bootstrap');

		// some components require a bootstrap instance, to fulfil their job. In that case, use this:
		// const bootstrap = await import("bootstrap");
		// sample usage:
		// const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample)
	});
</script>

<!-- Back To Top -->
<div
	class="backtotop"
	style="position: fixed; margin-bottom: 25px; margin-right: 50px; bottom: 0; right: 0"
	alt="Back to Top"
>
	<a style="position: relative; bottom: 0; right: 0;" href="#top">
		<img src="/img/arrow-up.png" title="Back to Top" />
	</a>
</div>

<!-- Popup -->
<div
	id="popup"
	style="display: none; position: absolute; top: 217px; width: 99%; z-index: 3; padding: 5px;"
></div>

<!-- Header Text/Image-->
<div style="text-align: center;">
	<a href="/" style="font-family: 'Unica One', cursive; font-size: 90px;">EVE-KILL</a>
</div>

<!-- Content -->
<div id="repository">
	<div id="contentkb">
		<section>
			<!-- Navbar -->
			<Navbar></Navbar>

			<!-- Dropdowns -->

			<!-- Page Content Section -->
			<section>
				<!-- Page Header -->
				<headerkb>
					<h1>PAGETITLE</h1>
				</headerkb>

				<!-- Page Message -->
				<div id="boardmessage">SOME MESSAGE</div>

				<!-- Right side main content -->
				<div id="content" style="width: 100%">content here!</div>

				<!-- Left side content -->
				<div id="context">context!</div>

				<div id="footerarea">
					<br />
					<div class="counter"></div>
					<br />
					<div class="footerbacktotop2" style="float: left">
						<a href="http://evekb.org/forum/viewtopic.php?f=1033&amp;t=18159">EVE+</a> theme by
						<a href="http://gate.eveonline.com/profile/vecati">Vecati</a>
						<br />
						Modified for Thessia by Karbowiak
					</div>
				</div>
			</section>
		</section>
	</div>
</div>
<slot></slot>

<style></style>
