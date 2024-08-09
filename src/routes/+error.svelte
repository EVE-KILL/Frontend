<script lang="ts">
    import fourOhFourImage from '../images/404.png';
</script>

<div id="fourohfour" style="background: url({fourOhFourImage}) no-repeat center center;"/>

<style>
    #fourohfour {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
        height: 60%;
        width: 100%;
        background-size: contain; /* Adjust image size to fit the container */
    }
</style>
