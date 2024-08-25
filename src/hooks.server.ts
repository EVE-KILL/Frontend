import type { Handle } from '@sveltejs/kit';
import { parse, serialize } from 'cookie';

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

	// Handle favicon request
	if (event.url.pathname === '/favicon') {
		return new Response(await fetch('/static/favicon.png'));
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
