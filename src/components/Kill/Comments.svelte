<script lang="ts">
	import { onMount } from 'svelte';
	import { session } from '$lib/stores/Session';
	import { getUpstreamUrl } from '$lib/Config.ts';

	export let identifier: string;
	let comments: any[] = [];
	let comment: string = '';
	let upstreamUrl = getUpstreamUrl();
	let user: any = null;

	onMount(async () => {
		await fetchComments();
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
		if (comment.trim() === '') return; // Prevent empty comments

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

	$: session.subscribe((value) => {
		user = value.user;
		if (user) {
			fetchComments();
		}
	});

</script>

<!-- Comments Section -->
<div class="overflow-x-auto">
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
					<div class="mt-2 text-white">{comment.comment}</div>
				</div>
			</div>
		</div>
	{/each}

	{#if user}
		<!-- Comment Input Box -->
		<div class="bg-semi-transparent bg-gray-800 rounded-lg shadow-lg p-4 mb-4">
			<div class="flex items-start">
				<img
					src={`https://images.evetech.net/characters/${user.character_id}/portrait?size=64`}
					alt="User avatar"
					class="h-16 w-16 rounded-md mr-4"
				/>
				<div class="flex flex-col w-full">
					<div class="text-left text-sm text-white">
						<strong>{user.character_name}</strong><br/>
					</div>
					<textarea
						class="w-full bg-gray-700 text-white rounded-md p-2"
						rows="4"
						placeholder="Write a comment..."
						bind:value={comment}
					></textarea>
				</div>
			</div>
			<div class="flex justify-end mt-2">
				<button class="post-button" on:click={() => postComment(comment)}>Post Comment</button>
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
</style>
