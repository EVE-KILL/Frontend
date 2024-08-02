// src/hooks.server.ts
import type { Handle } from '@sveltejs/kit';
import { parse, serialize } from 'cookie';

export const handle: Handle = async ({ event, resolve }) => {
    const cookies = parse(event.request.headers.get('cookie') || '');
    const session = cookies.session ? JSON.parse(cookies.session) : null;

    event.locals.user = session ? session.user : null;

    const response = await resolve(event);

    if (event.locals.user) {
        response.headers.set('set-cookie', serialize('session', JSON.stringify({ user: event.locals.user }), {
            path: '/',
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7 // 1 week
        }));
    }

    return response;
};
