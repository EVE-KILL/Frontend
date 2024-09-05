<script lang="ts">
	import YouTubeEmbed from '../Carta/YouTubeEmbed.svelte';
	import ImageEmbed from '../Carta/ImageEmbed.svelte';
	import { onMount } from 'svelte';
	import { session } from '$lib/stores/Session';
	import { getUpstreamUrl } from '$lib/Config.ts';
	import { Carta, Markdown, MarkdownEditor } from 'carta-md';
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

	// Define the character limit for comments
	const commentLimit = 500;
	let charactersRemaining = commentLimit;

	let mappedComponents = [
		svelteCustom(
			'youtube',
			(node) => {
				if (node.tagName === 'a' && (node.properties.href.includes('youtube.com') || node.properties.href.includes('youtu.be'))) {
					return true
				}
				return false;
			},
			YouTubeEmbed
		),
		svelteCustom(
			'image',
			(node) => {
				// Ensure the tagName is a for links, and then check for it either ending in .jpeg, .jpg, .gif, or .png or contains an image extension in the url
				if (node.tagName === 'a' && (node.properties.href.match(/\.(jpeg|jpg|gif|png)$/) != null || node.properties.href.includes('.jpeg') || node.properties.href.includes('.jpg') || node.properties.href.includes('.gif') || node.properties.href.includes('.png'))) {
					return true;
				}
				return false;
			},
			ImageEmbed
		)
	];

	let carta = new Carta({
		sanitizer: DOMPurify.sanitize,
		theme: 'github-dark',
		extensions: [
			emoji(),
			component(mappedComponents)
		]
	});

	function insertLine(input: string, string: string): string {
		const line = input.getLine();
		if (line.value !== '') {
			input.insertAt(line.end, `\n${string}`);
			const newPos = line.end + string.length + 1;
			input.textarea.selectionStart = newPos;
			input.textarea.selectionEnd = newPos;
		} else {
			input.insertAt(line.end, `${string}`);
			const newPos = line.end + string.length;
			input.textarea.selectionStart = newPos;
			input.textarea.selectionEnd = newPos;
		}
	}

	onMount(async () => {
		await fetchComments();
		initializeComponents(mappedComponents, container)
	});

	async function fetchComments() {
		try {
			let request = await fetch(`${upstreamUrl}/api/comments/${identifier}`);
			if (request.ok) {
				comments = await request.json();
			} else {
				console.error('Failed to fetch comments:', request.statusText);
			}
		} catch (error) {
			console.error('Error fetching comments:', error);
		}
	}

	async function postComment(comment: string) {
		if (comment.trim() === '' || comment.length > commentLimit) return; // Prevent empty comments and limit exceeding

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
				await fetchComments(); // Fetch the latest comments after posting
				comment = ''; // Clear the input box
				charactersRemaining = commentLimit; // Reset character counter
			} else {
				console.error('Failed to post comment:', request.statusText);
			}
		} catch (error) {
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

	// Watch the comment input to update charactersRemaining
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
	<!-- Display Comments -->
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
					<Markdown value={comment.comment} {carta} />
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

					<MarkdownEditor bind:value={comment} mode=undefined theme="github" placeholder="Leave a comment.." {carta} />
					<p class="text-right text-xs text-gray-400">
						{charactersRemaining} characters remaining
					</p>
					{#if charactersRemaining < 0}
						<p class="text-right text-xs text-red-500">Comment exceeds the maximum length!</p>
					{/if}
				</div>
			</div>
			<div class="flex justify-end mt-2">
				<button class="post-button" on:click={() => postComment(comment)} disabled={charactersRemaining < 0}>
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

	.post-button {
		background-color: #4a4a4a;
		color: white;
		border: none;
		padding: 10px 20px;
		border-radius: 5px;
		cursor: pointer;
	}

	.post-button:hover {
		background-color: #6a6a6a;
	}

	.post-button:disabled {
		background-color: #6a6a6a;
		cursor: not-allowed;
	}
</style>
