<script lang="ts">
    export let href;
    let videoId;

    // Extract the video ID from the URL
    if (href) {
        const url = new URL(href);
        videoId = url.searchParams.get('v');
    }
</script>

<div class="video-container">
    <iframe
        title="YouTube video player"
        src="https://www.youtube.com/embed/{videoId}"
        frameborder="0"
        allowfullscreen
    >
    </iframe>
</div>

<style>
    .video-container {
        width: 100%;
        max-width: 560px;
        margin: 0 auto;
    }
</style>
