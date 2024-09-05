<script lang="ts">
	import YouTubeEmbed from '../Carta/YouTubeEmbed.svelte';
	import ImageEmbed from '../Carta/ImageEmbed.svelte';
	import { onMount } from 'svelte';
	import { session } from '$lib/stores/Session';
	import { getUpstreamUrl } from '$lib/Config.ts';
	import { Carta, MarkdownEditor } from 'carta-md';
	import { emoji } from '@cartamd/plugin-emoji';
	import { component } from '@cartamd/plugin-component';
	import { initializeComponents, svelteCustom } from '@cartamd/plugin-component/svelte';
	import DOMPurify from 'isomorphic-dompurify';

	import '$lib/styles/github.scss';
	import '@cartamd/plugin-emoji/default.css';

	export let identifier: string;
	let comments: any[] = [];
	let comment: string = '';
	let upstreamUrl = getUpstreamUrl();
	let user: any = null;
	let container: HTMLElement;

	const commentLimit = 500;
	let charactersRemaining = commentLimit;

	let lastPostedComment: string = ''; // To track the last posted comment
	let errorMessage: string = ''; // To store error messages from the API

	let mappedComponents = [
		svelteCustom(
			'youtube',
			(node) => {
				if (node.tagName === 'a' && (node.properties.href.includes('youtube.com') || node.properties.href.includes('youtu.be'))) {
					return true;
				}
				return false;
			},
			YouTubeEmbed
		),
		svelteCustom(
			'image',
			(node) => {
				if (node.tagName === 'a' && (node.properties.href.match(/\.(jpeg|jpg|gif|png)$/) != null || node.properties.href.includes('.jpeg') || node.properties.href.includes('.jpg') || node.properties.href.includes('.gif') || node.properties.href.includes('.png'))) {
					return true;
				}
				return false;
			},
			ImageEmbed
		)
	];

	let fakeInitialize = function() { return null; }
	let carta = new Carta({
		sanitizer: DOMPurify.sanitize,
		theme: 'github-dark',
		extensions: [
			emoji(),
			component(mappedComponents, fakeInitialize)
		]
	});

	onMount(async () => {
		await fetchComments();
		initializeComponents(mappedComponents, container);
	});

	async function fetchComments() {
		try {
			let request = await fetch(`${upstreamUrl}/api/comments/${identifier}`);
			if (request.ok) {
				let fetchedComments = await request.json();

				// Render each comment's markdown
				const renderedComments = await Promise.all(
					fetchedComments.map(async (comment) => {
						comment.rendered = await carta.render(comment.comment);
						return comment;
					})
				);

				// Now update the comments array
				comments = renderedComments;
			} else {
				console.error('Failed to fetch comments:', request.statusText);
			}
		} catch (error) {
			console.error('Error fetching comments:', error);
		}
	}

	async function postComment() {
		if (comment.trim() === '' || comment.length > commentLimit) return;

		// Check if the comment is the same as the last one posted
		if (comment.trim() === lastPostedComment.trim()) {
			errorMessage = 'You cannot post the same comment consecutively.';
			return;
		}

		let commentObject = {
			identifier: user.identifier,
			comment: comment
		};

		try {
			let request = await fetch(`${upstreamUrl}/api/comments/${identifier}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(commentObject)
			});

			if (request.ok) {
				const result = await request.json();

				if (result.error) {
					errorMessage = result.error; // Display error message
				} else {
					result.rendered = await carta.render(result.comment); // Render the new comment
					comments = [result, ...comments]; // Add the new comment to the top of the array

					lastPostedComment = comment.trim(); // Update last posted comment
					comment = ''; // Clear the input box
					charactersRemaining = commentLimit; // Reset character counter
					errorMessage = ''; // Clear any previous error messages
				}
			} else {
				console.error('Failed to post comment:', request.statusText);
			}
		} catch (error) {
			errorMessage = 'An error occurred while posting the comment.';
			console.error('Error posting comment:', error);
		}
	}

	function infoString(corporationName: string, allianceName: string) {
		if (corporationName && allianceName) {
			return `${corporationName} / ${allianceName}`;
		} else if (corporationName) {
			return corporationName;
		} else if (allianceName) {
			return allianceName;
		} else {
			return '';
		}
	}

	$: charactersRemaining = commentLimit - comment.length;

	$: session.subscribe((value) => {
		user = value.user;
		if (user) {
			fetchComments();
		}
	});
</script>

<!-- Comments Section -->
<div class="overflow-x-auto" bind:this={container}>
	{#each comments as comment}
		<div class="comment bg-semi-transparent bg-gray-800 rounded-lg shadow-lg p-4 mb-4">
			<div class="flex items-start">
				<img
					src={`https://images.evetech.net/characters/${comment.character.character_id}/portrait?size=64`}
					alt={comment.character.character_name}
					class="h-16 w-16 rounded-md mr-4"
				/>
				<div>
					<div class="text-left text-sm text-white">
						<strong>{comment.character.character_name}</strong><br/>
						<p class="text-xs text-gray-500">({infoString(comment.character.corporation_name, comment.character.alliance_name)})</p>
						<p class="text-sm text-gray-500">{comment.created_at}</p>
					</div>
					<!-- Rendered Markdown -->
					<div class="markdown-content">{@html comment.rendered}</div>
				</div>
			</div>
		</div>
	{/each}

	{#if user}
		<!-- Comment Input Box -->
		<div class="bg-semi-transparent bg-gray-800 rounded-lg shadow-lg p-4 mb-4">
			<div class="flex items-start">
				<div class="flex flex-col w-full">
					<img
						src={`https://images.evetech.net/characters/${user.character_id}/portrait?size=64`}
						alt="User avatar"
						class="h-16 w-16 rounded-md mr-4"
					/>
					<div class="text-left text-sm text-white">
						<strong>{user.character_name}</strong><br/>
					</div>

					<MarkdownEditor bind:value={comment} theme="github" placeholder="Leave a comment.." {carta} />
					<p class="text-right text-xs text-gray-400">
						{charactersRemaining} characters remaining
					</p>
					{#if charactersRemaining < 0}
						<p class="text-right text-xs text-red-500">Comment exceeds the maximum length!</p>
					{/if}

					<!-- Error message display -->
					{#if errorMessage}
						<p class="text-red-500 text-sm mt-2">{errorMessage}</p>
					{/if}
				</div>
			</div>
			<div class="flex justify-end mt-2">
				<button class="post-button {charactersRemaining >= 0 && comment.trim() !== '' ? 'enabled' : 'disabled'}" on:click={postComment} disabled={charactersRemaining < 0 || comment.trim() === ''}>
					Post Comment
				</button>
			</div>
		</div>
	{/if}
</div>

<style>
	.comment {
		margin-bottom: 5px;
	}

	.markdown-content {
		margin-top: 10px;
	}

	.post-button {
		background-color: #4a4a4a;
		color: white;
		border: none;
		padding: 10px 20px;
		border-radius: 5px;
		cursor: pointer;
	}

	.post-button.enabled {
		background-color: #007bff; /* Blue when enabled */
	}

	.post-button.disabled {
		background-color: #4a4a4a; /* Stay gray when disabled */
		cursor: not-allowed;
	}

	.post-button:hover.enabled {
		background-color: #0056b3; /* Darker blue when hovered and enabled */
	}

	.text-red-500 {
		color: #f56565;
	}
</style>
