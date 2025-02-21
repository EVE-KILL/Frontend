import { getAccessToken, verify } from '$lib/Auth.js';
import { backendFetch } from '$lib/backendFetcher.js';
import { getUpstreamUrl } from '$lib/Config.js';

export async function load({ request }) {
    const url = new URL(request.url);
    const urlParams = url.searchParams;
    const code: string | null = urlParams.get('code');
    const state: string | null = urlParams.get('state');

    // Idea is to use a state to prevent CSRF attacks
    // So on generating the auth URL, we generate a random state
    // That is tied to this specific user's session
    // And then we check that the state is the same as the one we generated
    // If it's not, we throw an error and prevent authentication
    // For now tho, we just hardcode it..
    if (state !== 'state') {
        throw new Error('Invalid state');
    }

    if (!code || !state) {
        throw new Error('Invalid code or state');
    }

    let accessTokenRequest = await getAccessToken(code);
    if (accessTokenRequest.error) {
        return {
            'error': accessTokenRequest.error
        }
    }

    let accessToken = accessTokenRequest.access_token;
    let expiresIn = accessTokenRequest.expires_in;
    let refreshToken = accessTokenRequest.refresh_token;

    // Verify the accessToken
    let verifyResponse = await verify(accessToken);
    let characterId = verifyResponse.CharacterID;
    let characterName = verifyResponse.CharacterName;
    let scopes = verifyResponse.Scopes;
    let tokenType = verifyResponse.TokenType;
    let characterOwnerHash = verifyResponse.CharacterOwnerHash;

    // Generate a unique identifier
    const uniqueIdentifier = crypto.randomUUID();

    // Submit everything to the backend API
    let submitPayload = {
        accessToken: accessToken,
        expiresIn: expiresIn,
        refreshToken: refreshToken,
        characterId: characterId,
        characterName: characterName,
        scopes: scopes,
        tokenType: tokenType,
        characterOwnerHash: characterOwnerHash,
        uniqueIdentifier: uniqueIdentifier
    };

    // Submit the payload to the backend API
    let upstreamUrl = getUpstreamUrl();
    await backendFetch(`${upstreamUrl}/api/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(submitPayload)
    });

    // Return the information to the frontend
    return {
        authentication: {
            characterId: characterId,
            characterName: characterName,
            // Use the generated unique identifier
            identifier: uniqueIdentifier
        }
    };
}
