import type { LayoutServerLoad } from "./$types";
import { getAuthUrl } from '$lib/Auth';

export const load: LayoutServerLoad = async () => {
	let scopes = [
		'esi-killmails.read_corporation_killmails.v1',
		'esi-killmails.read_killmails.v1',
		'publicData'
	];
	let state = 'state';
	let callbackUrl: string = process.env.EVE_CLIENT_REDIRECT || 'http://localhost:3001/auth/callback';
    let eveLoginUrl = await getAuthUrl(callbackUrl, scopes, state);

    return {
        eveLoginUrl: eveLoginUrl
    }
};
