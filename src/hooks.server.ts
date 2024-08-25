import type { Handle } from '@sveltejs/kit';
import { parse, serialize } from 'cookie';
import { LRUCache } from 'lru-cache';
import crypto from 'crypto';

type CachedResponse = {
	statusCode: number;
	headers: Record<string, string>;
	body: Buffer;
};

// Initialize cache with a maximum size of 2GB
const cache = new LRUCache<string, CachedResponse>({
	maxSize: 2 * 1024 * 1024 * 1024, // 2GB in bytes
	sizeCalculation: (value) => value.body.length,
	ttl: 60 * 60 * 24 * 7, // 1 week
	allowStale: true
});

// Helper function to create a hash of the cache key
const hashKey = (key: string) => crypto.createHash('sha256').update(key).digest('hex');

// Function to handle CORS
const setCorsHeaders = (headers: Headers) => {
	headers.set('Access-Control-Allow-Origin', '*');
	headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
	headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
};

export const handle: Handle = async ({ event, resolve }) => {
	// Parse cookies to manage session
	const cookies = parse(event.request.headers.get('cookie') || '');
	const session = cookies.session ? JSON.parse(cookies.session) : null;
	event.locals.user = session ? session.user : null;

	// Handle healthcheck route
	if (event.url.pathname === '/healthcheck') {
		return new Response('ok', { status: 200 });
	}

	// Handle favicon request
	if (event.url.pathname === '/favicon') {
		return new Response(await fetch('/static/favicon.png'));
	}

	// Handle requests to images.eve-kill.com
	if (event.url.hostname === 'images.eve-kill.com') {
		const targetUrl = `https://images.evetech.net${event.url.pathname}`;
		const cacheKey = hashKey(event.url.pathname);

		if (cache.has(cacheKey)) {
			// Serve from cache
			const cachedResponse = cache.get(cacheKey);
			const responseHeaders = new Headers(cachedResponse!.headers);
			setCorsHeaders(responseHeaders);

			return new Response(cachedResponse!.body, {
				status: cachedResponse!.statusCode,
				headers: responseHeaders
			});
		}

		try {
			const proxyRes = await fetch(targetUrl, {
				method: event.request.method,
				headers: event.request.headers
			});

			const bodyBuffer = Buffer.from(await proxyRes.arrayBuffer());
			const responseHeaders = Object.fromEntries(proxyRes.headers.entries());

			// Cache the response
			cache.set(cacheKey, {
				statusCode: proxyRes.status,
				headers: responseHeaders,
				body: bodyBuffer
			});

			// Return the proxied response
			return new Response(bodyBuffer, {
				status: proxyRes.status,
				headers: new Headers({
					...responseHeaders,
					'Cache-Control': 'public, max-age=31536000' // 1 year caching
				})
			});
		} catch (error) {
			return new Response(error.message, { status: 500 });
		}
	}

	// Resolve the request and generate the response
	const response = await resolve(event);

	// Ensure CORS headers are set on all responses, including .svelte pages
	setCorsHeaders(response.headers);

	// Set the session cookie if the user is authenticated
	if (event.locals.user) {
		response.headers.set(
			'set-cookie',
			serialize('session', JSON.stringify({ user: event.locals.user }), {
				path: '/',
				httpOnly: true,
				sameSite: 'strict',
				secure: process.env.NODE_ENV === 'production',
				maxAge: 60 * 60 * 24 * 7 // 1 week
			})
		);
	}

	return response;
};
