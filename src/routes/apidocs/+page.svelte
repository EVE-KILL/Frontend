<script lang="ts">
    import { getUpstreamUrl } from '$lib/Config';
    import { ApiReferenceReact } from '@scalar/api-reference-react';

    const upstreamUrl = getUpstreamUrl();
</script>

<react:ApiReferenceReact configuration={{spec: {url: `${upstreamUrl}/api/openapi`}}}/>
