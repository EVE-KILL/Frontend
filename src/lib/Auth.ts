export async function getAuthUrl(callbackUrl: string, scopes: string[], state: string) {
    let clientId = process.env.EVE_CLIENT_ID;
    if (!clientId) {
        throw new Error('EVE_CLIENT_ID is not defined');
    }

    let urlParams = new URLSearchParams({
        response_type: 'code',
        redirect_uri: callbackUrl,
        client_id: clientId,
        scope: scopes.join(' '),
        state: state
    });

    let url = `https://login.eveonline.com/v2/oauth/authorize?${urlParams.toString()}`;
    return url;
}

export async function getAccessToken(code: string) {
    let payload = {
        grant_type: 'authorization_code',
        code: code,
    };

    let authorization = Buffer.from(`${process.env.EVE_CLIENT_ID}:${process.env.EVE_CLIENT_SECRET}`).toString('base64');
    let response = await fetch('https://login.eveonline.com/v2/oauth/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': 'EVE-KILL',
            'Authorization': 'Basic ' + authorization
        },
        body: new URLSearchParams(payload).toString()
    });

    let json = await response.json();
    return json;
}

export async function verify(accessToken: string) {
    let response = await fetch('https://login.eveonline.com/oauth/verify', {
        headers: {
            'Authorization': 'Bearer ' + accessToken
        }
    });

    let json = await response.json();
    return json;
}
