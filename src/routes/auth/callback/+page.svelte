<script lang="ts">
    import { browser } from '$app/environment';

    export let data;
    let error: string = data.error || '';
    let authentication = data.authentication || {};

    if (browser) {
        // Set the authentication data into the browser local storage
        localStorage.setItem('authentication', JSON.stringify(authentication));
        // Redirect to the home page
        window.location.href = '/';
    }
</script>
