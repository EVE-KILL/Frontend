<script lang="ts">
	import { onMount } from 'svelte';
	import { getUpstreamUrl } from '$lib/Config';

	const upstreamUrl = getUpstreamUrl();
	let sortedComments = [];
	let newComment = '';
	let comments = [];
	let url: string;

    onMount(async () => {
		url = window.location.pathname;
        await fetchComments(url);
        sortComments('date');
    });

    async function fetchComments(url: string) {
		const response = await fetch(`${upstreamUrl}/api/comments`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: url
		});

		comments = await response.json();
		console.log(comments);
		sortComments('date');
    }

    function sortComments(criteria) {
        if (criteria === 'date') {
            sortedComments = [...comments].sort((a, b) => new Date(b.last_modified) - new Date(a.last_modified));
        }
    }

    async function postComment(url: string) {
        if (newComment.trim() !== '') {
            const comment = {
                body: newComment,
                identifier: 'some-identifier', // Replace with actual identifier
                url: url
            };

            try {
                const response = await fetch(`${upstreamUrl}/api/comments/post`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(comment)
                });

                const result = await response.json();

                if (response.ok) {
                    await fetchComments(); // Refresh comments after posting
                    newComment = '';
                } else {
                    console.error('Error posting comment:', result.error);
                }
            } catch (error) {
                console.error('Error posting comment:', error);
            }
        }
    }

	function getColorFromRating(rating: number) {
		const clampedRating = Math.max(-10, Math.min(10, rating));
		const red = Math.round(255 * (1 - (clampedRating + 10) / 20));
		const green = Math.round(255 * ((clampedRating + 10) / 20));
		return `rgb(${red}, ${green}, 0)`;
	}
</script>

<!-- Comments Section -->
<div class="overflow-x-auto" role="table">
	<table class="table-auto bg-semi-transparent bg-gray-800 rounded-lg shadow-lg w-full">
		<thead>
			<tr class="bg-darker text-white uppercase text-xs leading-normal">
				<th scope="col"></th>
				<th scope="col">Sorting</th>
				<th scope="col">
					<button class="sort-button" on:click={() => sortComments('rating')}
						>Rating</button
					>
				</th>
				<th scope="col">
					<button class="sort-button" on:click={() => sortComments('id')}>Posted</button>
				</th>
				<th scope="col">
					<button class="sort-button" on:click={() => sortComments('date')}>Date</button>
				</th>
			</tr>
		</thead>
		<tbody class="text-gray-300 text-sm">
			{#each sortedComments as comment}
				<tr
					class="border-b border-gray-700 hover:bg-gray-600 transition-colors duration-300"
				>
					<td class="px-1 py-1">
						<div class="comment-actions flex flex-col items-center">
							<button class="upvote flex items-center justify-center">
								<i class="fas fa-arrow-up"></i>
							</button>
							<div
								class="votes my-2"
								style="color: {getColorFromRating(comment.rating)}"
							>
								{comment.rating}
							</div>
							<button class="downvote flex items-center justify-center">
								<i class="fas fa-arrow-down"></i>
							</button>
						</div>
					</td>
					<td class="px-1 py-1">
						<img
							src="https://via.placeholder.com/128"
							alt={comment.character.character_name}
							class="h-16 w-16 rounded-md"
						/>
					</td>
					<td class="px-1 py-1" colspan="3">
						<div class="text-left text-xs">
							{comment.character.character_name} <br />
							<div class="text-gray-500">
								{comment.character.corporation_name} / {comment.character
									.alliance_name}
							</div>
						</div>
						<div class="mt-2">{comment.body}</div>
						<div class="text-gray-500 text-xs mt-2 text-right">{comment.last_modified}</div>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
	<!-- Comment Input Box -->
	<div class="bg-semi-transparent bg-gray-800 rounded-lg shadow-lg p-4 mb-4">
		<div class="flex items-start">
			<img
				src="https://via.placeholder.com/128"
				alt="Current User"
				class="h-16 w-16 rounded-md mr-4"
			/>
			<textarea
				class="w-full bg-gray-700 text-white rounded-md p-2"
				rows="4"
				placeholder="Write a comment..."
				bind:value={newComment}
			></textarea>
		</div>
		<div class="flex justify-end mt-2">
			<button class="post-button" on:click={postComment(url)}>Post Comment</button>
		</div>
	</div>
</div>

<style>
	.comment-actions {
		display: flex;
		align-items: center;
	}

	.upvote,
	.downvote {
		background: none;
		border: none;
		padding: 0;
		cursor: pointer;
	}

	.sort-button {
		background-color: #4a4a4a;
		color: white;
		border: none;
		padding: 5px 10px;
		margin-right: 10px;
		border-radius: 5px;
		cursor: pointer;
	}

	.sort-button:hover {
		background-color: #6a6a6a;
	}
</style>
