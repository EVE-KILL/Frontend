<script>
    import fourOhFourImage from '../images/404.png';
</script>

<div class="container text-white" style="background-image: url({fourOhFourImage}); background-size: cover; background-repeat: no-repeat; background-position: center center;"/>

<style>
    :global(html) {
        background: radial-gradient(circle, transparent, black 80%);
        background-color: black;
    }

    .container {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
        width: 30%;
        height: 30%;
    }
</style>
